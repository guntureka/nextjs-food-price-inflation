"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/loading-button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format, getYear, setYear } from "date-fns";
import { SelectCountry, SelectFood, SelectFoodPriceIndex } from "@/db/schema";
import { createFoodPrice } from "@/lib/actions/food-prices";
import {
  createFoodPriceIndex,
  updateFoodPriceIndex,
} from "@/lib/actions/food-price-indexes";

const startYear = getYear(new Date()) - 100;
const endYear = getYear(new Date());

const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => endYear - i,
);

const formSchema = z.object({
  open: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  low: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  high: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  close: z.number().or(z.string()).pipe(z.coerce.number()).optional(),
  date: z.date(),
  year: z.number(),
  month: z.number(),
  countryId: z.string().min(1, "Country is required"),
});

type formValues = z.infer<typeof formSchema>;

interface UpdateFoodPriceFormProps {
  countries: SelectCountry[];
  foodPriceIndex: SelectFoodPriceIndex;
}

export function UpdateFoodPriceIndexForm({
  countries,
  foodPriceIndex,
}: UpdateFoodPriceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      open: foodPriceIndex.open ?? undefined,
      low: foodPriceIndex.low ?? undefined,
      high: foodPriceIndex.high ?? undefined,
      close: foodPriceIndex.close ?? undefined,
      date: foodPriceIndex.date,
      year: foodPriceIndex.date.getFullYear(),
      month: foodPriceIndex.date.getMonth(),
      countryId: foodPriceIndex.countryId,
    },
  });

  const onSubmit = async (values: formValues) => {
    setIsLoading(true);
    try {
      await updateFoodPriceIndex(foodPriceIndex.id, values);

      toast.success("Succes");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", { description: error.message });
      } else {
        toast.error("Error", { description: "Something wen't wrong." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (date?: Date) => {
    if (!date) return;

    form.setValue("date", date);
    form.setValue("year", date.getFullYear());
    form.setValue("month", date.getMonth());
    form.trigger("date");
  };

  const onYearChange = (year: number) => {
    setDate(setYear(date, year));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-8")}>
        <div className="flex w-full flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-primary">Update Food Price</h1>
        </div>
        <FormField
          name={"countryId"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="capitalize">Country</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((v, i) => (
                      <SelectItem key={i} value={v.id} className="capitalize">
                        {v.name}
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
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold capitalize">
                {field.name}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="center">
                  <div className="flex w-full gap-2 p-4">
                    <Select
                      onValueChange={(v) => onYearChange(Number(v))}
                      value={getYear(date).toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={onDateChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    month={date}
                    onMonthChange={setDate}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {(["open", "low", "high", "close"] as const).map((name, i) => (
          <FormField
            key={i}
            name={name}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{field.name}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123.45"
                    type="number"
                    step={"0.01"}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
      </form>
    </Form>
  );
}
