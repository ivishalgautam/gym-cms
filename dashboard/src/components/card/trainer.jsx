import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { H1, H2, H3, H4, H5, H6 } from "../ui/typography";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const baseImageUrl = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;
export default function TrainerCard({ trainer, value }) {
  const avatarFallback =
    trainer.fullname.charAt(0) + trainer.fullname.split(" ")[1].charAt(0);
  return (
    <div
      key={trainer.id}
      className={cn(
        "cursor-pointer rounded-3xl border bg-white p-5 shadow-lg transition-colors",
        {
          "border-primary": value === trainer.id,
        },
      )}
    >
      <div className="space-y-4">
        <div className="col-span-5">
          <figure className="mx-auto w-28">
            <Image
              src={`${baseImageUrl}/${trainer.avatar}`}
              width={500}
              height={500}
              alt={trainer.fullname}
              className={cn(
                "rounded-full object-cover object-center  drop-shadow-lg",
              )}
            />
          </figure>
        </div>

        <div className="col-span-7 justify-center gap-1 space-y-2 text-pretty text-center text-lg font-medium">
          <div>
            <H3>{trainer.fullname}</H3>
          </div>
          <div className="flex items-center justify-center gap-3 rounded-lg bg-gray-100 p-3 text-center capitalize">
            <div className="flex-1">
              <div className="text-xs text-gray-500">Assigned</div>
              <span className="text-sm font-semibold">
                {trainer.assigned_members ?? 10}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500">Registered</div>
              <span className="text-sm font-semibold">
                {trainer.assigned_members ?? 10}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500">Type</div>
              <span className="text-sm font-semibold">
                {trainer.type ?? 10}
              </span>
            </div>
          </div>
          <div className="capitalize">
            <H5>Description</H5>
            <p className="text-xs text-gray-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
              nihil quas aperiam i
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
