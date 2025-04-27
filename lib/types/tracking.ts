// lib/types/tracking.ts

// Main API response structure
export interface SPXTrackingResponse {
    retcode: number;
    message: string;
    detail: string;
    debug: string;
    data: SPXTrackingData;
}

// Main data container
export interface SPXTrackingData {
    fulfillment_info: {
        deliver_type: number;
    };
    sls_tracking_info: SLSTrackingInfo;
    is_instant_order: boolean;
    is_shopee_market_order: boolean;
    order_info?: OrderInfo;
}

// Tracking information container
export interface SLSTrackingInfo {
    sls_tn: string;
    client_order_id: string;
    receiver_name: string;
    receiver_type_name: string;
    records: TrackingRecord[];
}

// Each tracking event/record
export interface TrackingRecord {
    tracking_code: string;
    tracking_name: string;
    description: string;
    display_flag: number;
    actual_time: number;
    operator: string;
    operator_phone: string;
    reason_code: string;
    reason_desc: string;
    epod: string;
    pin_code: string;
    current_location: LocationInfo;
    next_location: LocationInfo;
    display_flag_v2: number;
    buyer_description: string;
    seller_description: string;
    milestone_code: number;
    milestone_name: string;
}

// Location data structure
export interface LocationInfo {
    location_name: string;
    location_type_name: string;
    lng: string;
    lat: string;
    full_address: string;
}

// Order address information
export interface OrderInfo {
    pickup_address?: string;
    pickup_district?: string;
    pickup_city?: string;
    recipient_address?: string;
    recipient_district?: string;
    recipient_city?: string;
}

// Formatted tracking data for UI display
export interface FormattedTrackingInfo {
    status: string;
    updatedAt: string;
    origin: string;
    destination: string;
    estimatedDelivery: string;
    history: TrackingHistoryItem[];
    trackingNumber: string;
}

// Simplified history item for UI
export interface TrackingHistoryItem {
    status: string;
    time: Date;
    location: string;
    description: string;
    next_location?: string;
}

// Status type for consistent status handling
export enum TrackingStatus {
    PREPARING = "Đang chuẩn bị",
    PICKED_UP = "Đã lấy hàng",
    IN_TRANSIT = "Đang vận chuyển",
    OUT_FOR_DELIVERY = "Đang giao hàng",
    DELIVERED = "Đã giao hàng",
    FAILED_DELIVERY = "Giao hàng không thành công",
    RETURNED = "Đã hoàn trả",
    CANCELED = "Đã hủy"
}