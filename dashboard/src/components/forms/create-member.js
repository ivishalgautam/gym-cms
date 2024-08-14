"use client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import useFileUpload from "@/hooks/useFileUpload";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Trash } from "lucide-react";
import useFetchTrainers from "@/hooks/useFetchTrainers";
import useFetchMemberships from "@/hooks/useFetchMemberships";
import { useState } from "react";
import { H2, H4 } from "../ui/typography";
import { cn } from "@/lib/utils";
import TrainerCard from "../card/trainer";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import MembershipCard from "../card/membership";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const fetchMember = async (id) => {
  const { data } = await http().get(`${endpoints.followups.getAll}/${id}`);
  return data;
};

const defaultValues = {
  fullname: "",
  email: "",
  mobile_number: "",
  avatar: "",
  username: "",
  password: "",
  trainer_type: "",
  trainer_id: "",
  membership_id: "",
  discount_in_percent: "",
};

export default function CreateMemberForm({
  handleCreate,
  handleUpdate,
  type,
  memberId,
  leadId,
}) {
  const totalSteps = 5;
  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
  } = useForm({ defaultValues });
  const [currPos, setCurrPos] = useState(3);
  const [filePath, setFilePath, uploadFile, deleteFile] = useFileUpload();

  const { data: trainers } = useFetchTrainers();
  const { data: memberships } = useFetchMemberships();

  async function onSubmit(data) {
    if (!(await trigger())) return;
    const payload = {
      fullname: data.fullname,
      email: data.email,
      mobile_number: data.mobile_number,
      avatar: filePath[0],
      username: data.username,
      password: data.password,
      trainer_type: data.trainer_type,
      trainer_id: data.trainer_id ?? null,
      membership_id: data.membership_id,
      discount_in_percent: data?.discount_in_percent ?? 0,
      lead_id: leadId,
    };

    if (type === "create") {
      handleCreate(payload);
    } else {
      handleUpdate({ ...payload, id: memberId });
    }
  }
  async function handleFileChange(event) {
    uploadFile(event);
  }

  const handleNext = async () => {
    if (!(await trigger())) return;
    const newPos = currPos + 1;
    if (newPos > totalSteps) return;
    setCurrPos(newPos);
  };

  const handlePrev = () => {
    const newPos = currPos - 1;
    if (newPos < 1) return;
    setCurrPos(newPos);
  };

  const handleDeleteFile = (filePath) => {
    deleteFile(filePath);
    setValue("avatar", "");
  };

  useEffect(() => {
    if (memberId && type === "edit") {
      (async function () {
        const followup = await fetchMember(memberId);
        setValue("fullname", followup?.fullname);
        setValue("email", followup?.email);
        setValue("mobile_number", followup?.mobile_number);
        setValue("username", followup?.username);
        setValue("password", followup?.password);
      })();
    }
  }, [memberId, type]);

  useEffect(() => {
    const fetchLead = async () => {
      const { data } = await http().get(`${endpoints.leads.getAll}/${leadId}`);
      setValue("fullname", data?.fullname);
      setValue("email", data?.email);
      setValue("mobile_number", data?.mobile_number);
    };

    if (leadId && type === "create") {
      fetchLead();
    }
  }, [leadId, type]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <H2>{type === "create" ? "Create Member" : "Update Member"}</H2>
        <div className=" overflow-auto p-4">
          {/* 1 */}
          {currPos === 1 && (
            <div className="mx-auto max-w-96 space-y-3 rounded-lg bg-white p-6 shadow-lg">
              <H4 className={"text-center"}>Basic Details</H4>
              <div className="gris-cols-2 grid gap-2">
                {/* avatar */}
                <div className="col-span-2">
                  <Label>Avatar</Label>
                  {filePath.length ? (
                    <figure className="relative mx-auto size-32">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${filePath[0]}`}
                        width={100}
                        height={100}
                        alt="avatar"
                        className="rounded-full object-cover object-center"
                      />
                      <Button
                        className="absolute right-0 top-0"
                        onClick={() => handleDeleteFile(filePath[0])}
                        type="button"
                        size="icon"
                        variant="destructive"
                      >
                        <Trash />
                      </Button>
                    </figure>
                  ) : (
                    <Input
                      type="file"
                      {...register("avatar", {
                        required: "required*",
                      })}
                      placeholder="Enter Avatar"
                      onChange={handleFileChange}
                    />
                  )}
                  {errors.avatar && (
                    <span className="text-rose-500">
                      {errors.avatar.message}
                    </span>
                  )}
                </div>

                {/* fullname */}
                <div>
                  <Label>Fullname</Label>
                  <Input
                    {...register("fullname", {
                      required: "required*",
                    })}
                    placeholder="Enter Fullname"
                  />
                  {errors.fullname && (
                    <span className="text-rose-500">
                      {errors.fullname.message}
                    </span>
                  )}
                </div>

                {/* mobile_number */}
                <div>
                  <Label>Mobile number</Label>
                  <Input
                    {...register("mobile_number", {
                      required: "required*",
                    })}
                    placeholder="Enter Mobile Number"
                  />
                  {errors.mobile_number && (
                    <span className="text-rose-500">
                      {errors.mobile_number.message}
                    </span>
                  )}
                </div>

                {/* email */}
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input
                    {...register("email", {
                      required: "required*",
                    })}
                    placeholder="Enter Email"
                  />
                  {errors.email && (
                    <span className="text-rose-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2 */}
          {currPos === 2 && (
            <div className="mx-auto max-w-96 space-y-3 rounded-lg bg-white p-6 shadow-lg">
              <H4 className={"text-center"}>Credentials</H4>
              <div className="space-y-2">
                {/* username */}
                <div>
                  <Label>Username</Label>
                  <Input
                    {...register("username", {
                      required: "required*",
                    })}
                    placeholder="Enter Username"
                  />
                  {errors.username && (
                    <span className="text-rose-500">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                {/* password */}
                <div>
                  <Label>Password</Label>
                  <Input
                    {...register("password", {
                      required: "required*",
                    })}
                    placeholder="Enter Password"
                  />
                  {errors.password && (
                    <span className="text-rose-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3 */}
          {currPos === 3 && (
            <div className="space-y-3">
              <H4 className={"text-center"}>Select Trainer</H4>
              <div>
                <Label>Trainer type</Label>
                <Controller
                  control={control}
                  name="trainer_type"
                  rules={{ required: "required*" }}
                  render={({ field: { onChange, value } }) => (
                    <Select defaultValue={value} onValueChange={onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.trainer_type && (
                  <span className="text-red-500">
                    {errors.trainer_type.message}
                  </span>
                )}
              </div>
              {watch("trainer_type") === "personal" && (
                <div>
                  {errors.trainer_id && (
                    <span className="text-red-500">
                      {errors.trainer_id.message}
                    </span>
                  )}
                  <Controller
                    name="trainer_id"
                    control={control}
                    rules={{ required: "Please select a trainer*" }}
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup defaultValue={value} onValueChange={onChange}>
                        <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4">
                          {trainers?.map((trainer) => (
                            <Label
                              key={trainer.id}
                              htmlFor={trainer.id}
                              className="relative"
                            >
                              <span className="absolute left-4 top-4 flex size-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                                <span
                                  className={cn(
                                    "size-4 rounded-full bg-white transition-colors",
                                    {
                                      "bg-primary": value === trainer.id,
                                    },
                                  )}
                                ></span>
                              </span>
                              <RadioGroupItem
                                value={trainer.id}
                                id={trainer.id}
                                className="hidden"
                              />
                              <TrainerCard trainer={trainer} value={value} />
                            </Label>
                          ))}
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
              )}
            </div>
          )}

          {/* 4 */}
          {currPos === 4 && (
            <div className="space-y-3">
              <H4>Select Membership</H4>
              {errors.membership_id && (
                <span className="text-red-500">
                  {errors.membership_id.message}
                </span>
              )}
              <Controller
                name="membership_id"
                control={control}
                rules={{ required: "Please select a membership*" }}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup defaultValue={value} onValueChange={onChange}>
                    <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4">
                      {/* membership */}
                      {memberships?.map((membership) => (
                        <Label
                          key={membership.id}
                          htmlFor={membership.id}
                          className="relative"
                        >
                          <span className="absolute left-4 top-4 flex size-6 items-center justify-center rounded-full border-2 border-primary bg-white">
                            <span
                              className={cn(
                                "size-4 rounded-full bg-white transition-colors",
                                {
                                  "bg-primary": value === membership.id,
                                },
                              )}
                            ></span>
                          </span>
                          <RadioGroupItem
                            value={membership.id}
                            id={membership.id}
                            className="hidden"
                          />
                          <MembershipCard
                            membership={membership}
                            key={membership.id}
                            value={value}
                          />
                        </Label>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          )}

          {/* 5 */}
          {currPos === 5 && (
            <div className="mx-auto max-w-96 space-y-3 rounded-lg bg-white p-6 shadow-lg">
              <H4 className={"text-center"}>Discounts</H4>
              <div className="space-y-2">
                {/* discount */}
                <div>
                  <Label>Discount in percent</Label>
                  <Input
                    type="number"
                    {...register("discount_in_percent", {
                      valueAsNumber: true,
                    })}
                    placeholder="Enter Percent"
                  />
                  {errors.discount_in_percent && (
                    <span className="text-rose-500">
                      {errors.discount_in_percent.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Button type="button" onClick={handlePrev} variant={"outline"}>
            <ArrowLeft />
            &nbsp;Prev
          </Button>

          {currPos === totalSteps && <Button variant="primary">Submit</Button>}
          {currPos < totalSteps && (
            <Button type="button" onClick={handleNext} variant={"outline"}>
              Next &nbsp; <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
