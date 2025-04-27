// lib/constants/trackingStatus.ts

// English to Vietnamese status mapping
export const trackingStatusMapping: Record<string, string> = {
    // Pickup statuses
    "Pickup From Domestic Seller": "Đã lấy hàng từ người bán",
    "Pickup Attempt Started": "Đang lấy hàng",

    // Transit statuses
    "Enter Domestic First Mile Hub": "Đã đến kho trung chuyển đầu tiên",
    "Left Domestic First Mile Hub": "Đã rời kho trung chuyển đầu tiên",
    "Loaded to Truck in First Mile Hub": "Đã xếp lên xe vận chuyển",
    "Packed in First Mile Hub": "Đã đóng gói tại kho",
    "Enter Domestic Sorting Center": "Đã đến trung tâm phân loại",
    "Packed in Domestic Sorting Centre": "Đã đóng gói tại trung tâm phân loại",
    "Loaded to Truck in Sorting Centre": "Đã xếp lên xe vận chuyển",
    "Left Domestic Sorting Center": "Đã rời trung tâm phân loại",
    "Domestic Line Haul End": "Đã hoàn thành vận chuyển liên tỉnh",
    "Enter Last Mile Hub": "Đã đến kho phân phối cuối cùng",

    // Delivery statuses
    "Delivery Driver Assigned": "Đã phân công tài xế giao hàng",
    "Out For Delivery": "Đang giao hàng",
    "Delivery Attempt Failed": "Giao hàng không thành công",
    "Delivered": "Đã giao hàng thành công",

    // Return statuses
    "RTS Line Haul Transportation": "Đang vận chuyển trả về",
    "Enter RTS Sorting Centre": "Đã đến trung tâm phân loại hàng trả",
    "Return Attempt Started": "Bắt đầu hoàn trả hàng",
    "Returned to Sender": "Đã hoàn trả cho người gửi"
};

// Function to get Vietnamese status from English
export function getVietnameseStatus(englishStatus: string): string {
    return trackingStatusMapping[englishStatus] || englishStatus;
}

// Status grouping for better UI organization
export enum StatusGroup {
    PICKUP = "Lấy hàng",
    IN_TRANSIT = "Vận chuyển",
    OUT_FOR_DELIVERY = "Giao hàng",
    DELIVERED = "Đã giao",
    FAILED = "Không thành công",
    RETURNED = "Hoàn trả"
}

// Map statuses to status groups
export function getStatusGroup(status: string): StatusGroup {
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes('pickup')) {
        return StatusGroup.PICKUP;
    } else if (lowerStatus.includes('delivered') || lowerStatus.includes('thành công')) {
        return StatusGroup.DELIVERED;
    } else if (lowerStatus.includes('out for delivery') || lowerStatus.includes('đang giao')) {
        return StatusGroup.OUT_FOR_DELIVERY;
    } else if (lowerStatus.includes('failed') || lowerStatus.includes('không thành công')) {
        return StatusGroup.FAILED;
    } else if (lowerStatus.includes('return') || lowerStatus.includes('rts') || lowerStatus.includes('hoàn trả')) {
        return StatusGroup.RETURNED;
    } else {
        return StatusGroup.IN_TRANSIT;
    }
}