// lib/trackingService.ts
import { FormattedTrackingInfo, SPXTrackingResponse, TrackingHistoryItem } from '@/lib/types/tracking';
import { getVietnameseStatus } from '@/lib/constants/trackingStatus';

export async function fetchTrackingInfo(trackingNumber: string): Promise<SPXTrackingResponse> {
    const apiUrl = `https://spx.vn/shipment/order/open/order/get_order_info?spx_tn=${trackingNumber}&language_code=vi`;

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch tracking info: ${response.statusText}`);
    }

    return response.json();
}

export async function getTrackingInfo(trackingNumber: string): Promise<FormattedTrackingInfo> {
    try {
        const data = await fetchTrackingInfo(trackingNumber);

        // Extract tracking records and sort by time (newest first)
        const records = data.data.sls_tracking_info.records
            .sort((a, b) => b.actual_time - a.actual_time);

        // Get the latest record for status
        const latestRecord = records[0];

        // Create formatted history items
        const history: TrackingHistoryItem[] = records.map(record => ({
            status: getVietnameseStatus(record.tracking_name),
            time: new Date(record.actual_time * 1000),
            location: record.current_location?.full_address || record.current_location?.location_name || '',
            description: record.buyer_description || record.description,
            next_location: record.next_location?.full_address || record.next_location?.location_name || ''
        }));

        // Extract detailed origin information
        let origin = 'Không có thông tin';
        if (data.data.order_info?.pickup_address) {
            origin = data.data.order_info.pickup_address;
        } else if (data.data.order_info?.pickup_district && data.data.order_info?.pickup_city) {
            origin = `${data.data.order_info.pickup_district}, ${data.data.order_info.pickup_city}`;
        } else {
            // Try to find origin from earliest tracking record with location
            const firstPickupRecord = [...records].reverse().find(
                record => record.current_location?.full_address &&
                    (record.tracking_code.startsWith('F0') || record.tracking_code.startsWith('F1'))
            );
            if (firstPickupRecord?.current_location?.full_address) {
                origin = firstPickupRecord.current_location.full_address;
            }
        }

        // Extract detailed destination information
        let destination = 'Không có thông tin';
        if (data.data.order_info?.recipient_address) {
            destination = data.data.order_info.recipient_address;
        } else if (data.data.order_info?.recipient_district && data.data.order_info?.recipient_city) {
            destination = `${data.data.order_info.recipient_district}, ${data.data.order_info.recipient_city}`;
        } else {
            // Try to find destination from delivery records
            const deliveryRecord = records.find(
                record => record.tracking_code === 'F600' || record.tracking_code === 'F598'
            );
            if (deliveryRecord?.next_location?.full_address) {
                destination = deliveryRecord.next_location.full_address;
            } else if (deliveryRecord?.current_location?.full_address) {
                destination = deliveryRecord.current_location.full_address;
            }
        }

        // Find estimated delivery time from records
        let estimatedDelivery = 'Dự kiến giao hàng không xác định';

        // Check if order is already delivered or returned
        const isCompleted = latestRecord.tracking_code === 'F610' ||
            latestRecord.tracking_code === 'F999';

        if (!isCompleted) {
            // For packages in transit, try to estimate delivery time
            const lastMileRecord = records.find(
                record => record.tracking_code === 'F599' || record.tracking_code === 'F598'
            );

            if (lastMileRecord) {
                // Calculate estimated delivery from last mile record
                const lastMileTime = new Date(lastMileRecord.actual_time * 1000);
                const deliveryDate = new Date(lastMileTime);
                deliveryDate.setHours(deliveryDate.getHours() + 24);

                estimatedDelivery = `Dự kiến giao trước ${deliveryDate.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}`;
            }
        }

        // Create a formatted response
        return {
            status: getVietnameseStatus(latestRecord.tracking_name),
            updatedAt: new Date(latestRecord.actual_time * 1000).toLocaleString('vi-VN'),
            origin,
            destination,
            estimatedDelivery,
            history,
            trackingNumber: trackingNumber
        };
    } catch (error) {
        console.error(`Failed to fetch tracking info for ${trackingNumber}:`, error);
        throw error;
    }
}