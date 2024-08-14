import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Title from "../Title";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loader";

export default function MembershipPerkForm({
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
  } = useForm({ defaultValues: { content: "" } });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [`membership-perk-${id}`, id],
    queryFn: async function fetchData() {
      return await http().get(`${endpoints.membershipPerk.getAll}/${id}`);
    },
    enabled: !!id && type === "edit",
  });

  useEffect(() => {
    if (id && type === "edit") {
      // fetchData();
      data && setValue("id", data.id);
      data && setValue("content", data.content);
    }
  }, [data]);

  const onSubmit = (data) => {
    const payload = { id: data.id, content: data.content };
    type === "create" ? handleCreate(payload) : handleUpdate(payload);
  };

  if (isFetching) return <Loader />;

  return (
    <div className="space-y-2">
      <Title text={type === "create" ? "Create" : "Update"} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div>
            <Label>Perk</Label>
            <Input
              type="text"
              placeholder="Enter perk"
              {...register("content", { required: "required*" })}
            />
            {errors.content && (
              <span className="text-sm text-red-500">
                {errors.content.message}
              </span>
            )}
          </div>
          <div className="text-right">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
