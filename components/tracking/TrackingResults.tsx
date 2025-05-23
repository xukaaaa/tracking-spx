// components/tracking/TrackingResults.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTrackingInfo } from '@/lib/trackingService';
import { FormattedTrackingInfo } from '@/lib/types/tracking';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

interface TrackingHistoryItem {
  status: string;
  time: Date;
  location: string;
  description: string;
  next_location?: string;
}

type TrackingResult =
  | { info: FormattedTrackingInfo; error?: undefined }
  | { error: string; info?: undefined };

const getStatusColor = (status: string) => {
  const lowerStatus = status.toLowerCase();

  if ((lowerStatus.includes("delivered") ||
      lowerStatus.includes("đã giao") ||
      lowerStatus.includes("giao hàng thành công")) &&
      !lowerStatus.includes("không") &&
      !lowerStatus.includes("hoàn trả") &&
      !lowerStatus.includes("return")) {
    return "bg-green-500/90";
  }
  else if (lowerStatus.includes("failed") ||
      lowerStatus.includes("không thành công") ||
      lowerStatus.includes("giao hàng không") ||
      lowerStatus.includes("hủy") ||
      lowerStatus.includes("cancel") ||
      lowerStatus.includes("returned") ||
      lowerStatus.includes("return") ||
      lowerStatus.includes("rts") ||
      lowerStatus.includes("hoàn trả") ||
      lowerStatus.includes("trả hàng")) {
    return "bg-red-500/90";
  }
  else if (lowerStatus.includes("out for delivery") ||
      lowerStatus.includes("đang giao") ||
      lowerStatus.includes("delivery driver assigned") ||
      lowerStatus.includes("đã sắp xếp tài xế giao hàng")) {
    return "bg-blue-500/90";
  }
  else {
    return "bg-orange-500/90";
  }
};

interface TrackingResultsProps {
  trackingNumbers: string[];
}

export async function TrackingResults({ trackingNumbers }: TrackingResultsProps) {
  console.time("fetchTrackingResults");
  
  const trackingResults: TrackingResult[] = await Promise.all(
    trackingNumbers.map(async (code) => {
      try {
        const info = await getTrackingInfo(code);
        return { info };
      } catch (error) {
        console.error(`Error fetching tracking for ${code}:`, error);
        return { error: `Không thể tìm thấy thông tin cho mã vận đơn ${code}` };
      }
    })
  );
  
  console.timeEnd("fetchTrackingResults");

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6">
      <p className="text-muted-foreground mb-4">
        {trackingNumbers.length > 1
          ? `Đang hiển thị ${trackingNumbers.length} đơn hàng`
          : 'Đang hiển thị 1 đơn hàng'}
      </p>

      <div className="space-y-4">
        {trackingResults.map((result: TrackingResult, index: number) => {
          if (result.error) {
            return (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-3">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{trackingNumbers[index]}</div>
                    <div className="text-red-500 text-sm">{result.error}</div>
                  </div>
                </div>
              </div>
            );
          }

          const trackingInfo = result.info!;

          return (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-3">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{trackingInfo.trackingNumber}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="relative flex justify-center items-center mr-2 h-3 w-3">
                      <div
                        className={`${getStatusColor(trackingInfo.status)} h-2 w-2 rounded-full absolute z-10`}/>
                      <div
                        className={`absolute inset-0 ${getStatusColor(trackingInfo.status)} h-3 w-3 rounded-full animate-ping opacity-75`}
                        style={{animationDuration: '1.5s'}}/>
                    </div>
                    {trackingInfo.status}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Cập nhật</p>
                      <p>{dayjs(trackingInfo.updatedAt, "HH:mm:ss D/M/YYYY", 'vi', true).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dự kiến giao hàng</p>
                      <p>{trackingInfo.estimatedDelivery}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Gửi từ</p>
                      <p>{trackingInfo.origin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Giao đến</p>
                      <p>{trackingInfo.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="history">
                      <AccordionTrigger>
                        Lịch sử vận chuyển ({trackingInfo.history.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <ScrollArea className="h-60">
                          <div className="space-y-4">
                            {trackingInfo.history.map((item: TrackingHistoryItem, i: number) => (
                              <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className={`${getStatusColor(item.status)} h-2.5 w-2.5 relative top-1 flex-shrink-0 rounded-full`}></div>
                                  {i < trackingInfo.history.length - 1 && (
                                    <div className="w-0.5 h-full bg-border mt-1"></div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.status}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                  <div className="text-sm text-muted-foreground flex flex-col gap-y-1 mt-1">
                                    <div className="flex flex-col gap-x-4">
                                      <span>{dayjs(item.time).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')}</span>
                                      {item.location && <span>Vị trí: {item.location}</span>}
                                    </div>
                                    {item.next_location && (
                                      <div className="flex items-center text-xs text-primary">
                                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <span>Sắp đến: {item.next_location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}