import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Title from "../Title";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader";
import useFetchMembershipPerks from "@/hooks/useFetchMembershipPerks";
import Select from "react-select";

const months = [
  {
    value: 1,
    label: "One",
  },
  {
    value: 2,
    label: "Two",
  },
  {
    value: 3,
    label: "Three",
  },
  {
    value: 4,
    label: "Four",
  },
  {
    value: 5,
    label: "Five",
  },
  {
    value: 6,
    label: "Six",
  },
  {
    value: 7,
    label: "Seven",
  },
  {
    value: 8,
    label: "Eight",
  },
  {
    value: 9,
    label: "Nine",
  },
  {
    value: 10,
    label: "Ten",
  },
  {
    value: 11,
    label: "Eleven",
  },
  {
    value: 12,
    label: "Twelve",
  },
];

export default function MembershipForm({
  type,
  handleCreate,
  handleDelete,
  handleUpdate,
  id,
}) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({ defaultValues: { name: "", perks: [] } });

  const { data: perks } = useFetchMembershipPerks();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [`subscription-${id}`, id],
    queryFn: async function fetchData() {
      return await http().get(`${endpoints.subscriptions.getAll}/${id}`);
    },
    enabled: !!id && type === "edit",
  });

  useEffect(() => {
    if (id && type === "edit") {
      // fetchData();
      data && setValue("id", data.id);
      data && setValue("name", data.name);
    }
  }, [data]);

  const onSubmit = (data) => {
    console.log({ data });
    const payload = {
      id: data.id,
      name: data.name,
      price: data.price,
      duration_in_months: months.find(
        (so) => so.value === data.duration_in_months.value,
      ).value,
      perks: data?.perks.map(({ value }) => value),
    };
    type === "create" ? handleCreate(payload) : handleUpdate(payload);
  };

  if (isFetching) return <Loader />;

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Title text={type === "create" ? "Create" : "Update"} />
          <div className="space-y-2">
            {/* duration in months */}
            <div>
              <Label>Duration in months</Label>
              <Controller
                control={control}
                name="duration_in_months"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    options={months}
                    onChange={field.onChange}
                    value={field.value}
                    className="max-h-[150px]"
                  />
                )}
              />
            </div>

            {/* name */}
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                placeholder="Enter Price"
                {...register("price", {
                  required: "required*",
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <span className="text-sm text-red-500">
                  {errors.price.message}
                </span>
              )}
            </div>

            {/* price */}
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Enter name"
                {...register("name", { required: "required*" })}
              />
              {errors.name && (
                <span className="text-sm text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* perks */}
            <div>
              <Label>Perks</Label>
              <Controller
                name="perks"
                control={control}
                rules={{ required: "Please select perks" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={perks}
                    isMulti
                    className="font-mulish h-[42px] w-full rounded-md bg-[#F7F7FC] text-sm outline-none"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={
                      typeof document !== "undefined" && document.body
                    }
                    menuPosition="absolute"
                  />
                )}
              />
              {errors.perks && (
                <span className="text-red-600">{errors.perks.message}</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
