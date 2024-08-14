import React from "react";
import { Badge } from "../ui/badge";
import { Muted } from "../ui/typography";
import { Check } from "lucide-react";
import { currencyFormatter } from "@/lib/Intl";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function MembershipCard({ membership, value }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-transparent bg-white shadow-lg transition-colors",
        {
          "border-primary": value === membership.id,
        },
      )}
    >
      <div className="bg-primary/10 p-4 text-white">
        <div className="my-2 text-center text-4xl font-bold text-black">
          {currencyFormatter(membership.price)}
        </div>
        <div
          className={
            "-mb-[26px] text-center font-semibold uppercase text-primary"
          }
        >
          <Badge className={"bg-white shadow-sm"}>{membership.name}</Badge>
        </div>
      </div>

      <div className="p-4">
        <Muted className={"text-center font-semibold capitalize"}>
          What you will get
        </Muted>
        <ul className="space-y-1">
          <li className="flex items-center justify-start gap-1">
            <span className="rounded-full bg-primary/10 p-1 text-primary">
              <Check size={10} />
            </span>
            <span className="text-xs font-medium capitalize">
              {membership.duration_in_months} Months
            </span>
          </li>
          <li className="flex items-center justify-start gap-1">
            <span className="rounded-full bg-primary/10 p-1 text-primary">
              <Check size={10} />
            </span>
            <span className="text-xs font-medium capitalize">
              {currencyFormatter(
                membership.price / membership.duration_in_months,
              )}
              /Months
            </span>
          </li>
          {membership?.perks?.map((perk, idx) => (
            <li key={idx} className="flex items-center justify-start gap-1">
              <span className="rounded-full bg-primary/10 p-1 text-primary">
                <Check size={10} />
              </span>
              <span className="text-xs font-medium capitalize">{perk}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        <Button type="button" className="w-full" variant="primary">
          Select This Plan
        </Button>
      </div>
    </div>
  );
}
