// components/tracking/TrackingForm.tsx
'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Loader2} from "lucide-react";
import {handleClickChat} from "@/lib/action";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";

export function TrackingForm() {
    console.log("Home");

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const formSchema = z.object({
        trackingCodes: z.string()
            .nonempty('Vui lòng nhập mã vận đơn')
            .refine(value => {
                // Split by new line and check if all codes match the SPX pattern
                const codes = value.split('\n').filter(code => code.trim() !== '');
                return codes.length > 0 && codes.every(code => code.trim().toUpperCase().startsWith('SPX'));
            }, {
                message: 'Tất cả mã vận đơn phải bắt đầu bằng SPX'
            })
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            trackingCodes: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        // Get clean array of tracking codes
        const codes = values.trackingCodes
            .split('\n')
            .map(code => code.trim())
            .filter(code => code !== '');

        // URL encode the codes for the query parameter
        const trackingParam = encodeURIComponent(codes.join(','));

        // Simulate API call delay
        setTimeout(() => {
            router.push(`/tracking?spx_tn=${trackingParam}`);
        }, 1000);
    }

    // Function to clear errors when user types
    const handleInputChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    ) => {
        // Clear form errors for this field
        form.clearErrors('trackingCodes');
        // Call the original onChange from react-hook-form
        onChange(e);
    };



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="trackingCodes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mã vận đơn</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Nhập mỗi mã vận đơn trên một dòng (SPX...)"
                                    className="min-h-[120px]"
                                    {...field}
                                    onChange={(e) => handleInputChange(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    onClick={handleClickChat}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" />
                            Đang xử lý...
                        </>
                    ) : (
                        'Tra cứu đơn hàng'
                    )}
                </Button>
            </form>
        </Form>
    );
}