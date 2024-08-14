import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { format } from "date-fns";
import { H4 } from "../ui/typography";
import { cn } from "@/lib/utils";
import moment from "moment";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

const fetchFreezeData = async (id) => {
  return await http().get(`${endpoints.freezeMemberships.getAll}/${id}`);
};

export default function FreezeMembershipForm({
  handleCreate,
  handleUpdate,
  customerMembershipId,
  freezeId,
  type,
}) {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({ defaultValues: { start_date: "", end_date: "" } });

  const onSubmit = (data) => {
    const payload = {
      start_date: moment(data.start_date).format(),
      end_date: moment(data.end_date).format(),
    };
    if (type === "create") {
      handleCreate({ ...payload, id: customerMembershipId });
    } else {
      handleUpdate({ ...payload, id: freezeId });
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { data } = await fetchFreezeData(freezeId);
      const startDate = new Date(data.start_date.split("T")[0]);
      const endDate = new Date(data.end_date.split("T")[0]);

      setValue("start_date", startDate);
      setValue("end_date", endDate);
    }
    if (freezeId && type === "edit") {
      fetchData();
    }
  }, [freezeId, type]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <H4>Freeze membership</H4>
          <div>
            {/* start date */}
            <div>
              <Label>Start date</Label>
              <div>
                <Controller
                  control={control}
                  name="start_date"
                  rules={{ required: "required*" }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? (
                              format(value, "PPP")
                            ) : (
                              <span>Pick start date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            initialFocus
                            selected={value}
                            onSelect={onChange}
                            //   disabled={(date) =>
                            //     date > new Date() || date < new Date("1900-01-01")
                            //   }
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
              {errors.start_date && (
                <span className="text-red-600">
                  {errors.start_date.message}
                </span>
              )}
            </div>

            {/* end date */}
            <div>
              <Label>End date</Label>
              <div>
                <Controller
                  control={control}
                  name="end_date"
                  rules={{ required: "required*" }}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? (
                              format(value, "PPP")
                            ) : (
                              <span>Pick end date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            initialFocus
                            selected={value}
                            onSelect={onChange}
                            //   disabled={(date) =>
                            //     date > new Date() || date < new Date("1900-01-01")
                            //   }
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>

              {errors.end_date && (
                <span className="text-red-600">{errors.end_date.message}</span>
              )}
            </div>
          </div>

          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
}
