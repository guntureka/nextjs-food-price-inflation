"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectFood } from "@/db/schema";
import { getSIGDatas } from "@/lib/actions/sig";
import { zodResolver } from "@hookform/resolvers/zod";
import { getYear } from "date-fns";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoadingButton } from "../loading-button";

const SIGMap = dynamic(() => import("@/components/leaflet/sig-map"), {
  ssr: false,
});

const startYear = getYear(new Date()) - 100;
const endYear = getYear(new Date());
const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => endYear - i,
);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formSchema = z.object({
  food: z.string(),
  year: z.string(),
  month: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface SIGPageProps {
  foods: SelectFood[];
}

export function SIGForm({ foods }: SIGPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultFood = searchParams.get("food") ?? foods[0]?.id ?? "";
  const defaultYear =
    searchParams.get("year") ?? new Date().getFullYear().toString();
  const defaultMonth =
    searchParams.get("month") ?? (new Date().getMonth() + 1).toString();

  const [data, setData] = useState<{ countries: any[]; prices: any[] }>({
    countries: [],
    prices: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      food: defaultFood,
      year: defaultYear,
      month: defaultMonth,
    },
  });

  // Fetch data berdasarkan nilai form
  const fetchData = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const result = await getSIGDatas({
        foodId: values.food,
        year: Number(values.year),
        month: Number(values.month),
      });
      setData({
        countries: result.countries || [],
        prices: result.prices || [],
      });
    } catch (error) {
      console.error("Failed to fetch SIG data", error);
      setData({ countries: [], prices: [] });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data setiap kali URL searchParams berubah
  useEffect(() => {
    const values = {
      food: searchParams.get("food") ?? defaultFood,
      year: searchParams.get("year") ?? defaultYear,
      month: searchParams.get("month") ?? defaultMonth,
    };
    form.reset(values);
    fetchData(values);
  }, [searchParams, defaultFood, defaultYear, defaultMonth, form]);

  // Saat form submit, update URL dengan params baru tanpa reload page
  const onSubmit = (values: FormValues) => {
    const query = new URLSearchParams(values).toString();
    router.replace(`?${query}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 md:grid-cols-3"
        >
          <FormField
            name="food"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select food" />
                    </SelectTrigger>
                    <SelectContent>
                      {foods.map((food) => (
                        <SelectItem key={food.id} value={food.id}>
                          {food.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="year"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="month"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((monthName, index) => (
                        <SelectItem key={monthName} value={index.toString()}>
                          {monthName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-3">
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </Form>
      <SIGMap data={data} />
    </div>
  );
}
