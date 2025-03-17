"use client";

import { SelectFoodPriceIndex } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeatureCollection } from "geojson";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  countryId: z.string().optional(),
  month: z.number(),
  year: z.number(),
});

type formValues = z.infer<typeof formSchema>;

interface HomeMapProps {
  data: {
    id: string;
    name: string;
    countryCode: string;
    currency: string;
    geojsonUrl: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    foodPriceIndexes: SelectFoodPriceIndex[];
  };
  geojson?: FeatureCollection | null;
}

export function HomeMap({ ...props }: HomeMapProps) {
  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryId: "",
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
  });

  const onSubmit = async (values: formValues) => {
    console.log(values);
  };
  return (
    <div>
      {/* <Form {...form}>
        <form>
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
        </form>
      </Form> */}
    </div>
  );
}
