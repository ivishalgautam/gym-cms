import React, { useContext } from "react";
import { Badge } from "../ui/badge";
import { Muted } from "../ui/typography";
import { Check, Edit } from "lucide-react";
import { currencyFormatter } from "@/lib/Intl";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Progress } from "../ui/progress";
import { MainContext } from "@/store/context";

export default function MyMembershipCard({
  membership,
  openModal,
  setCustomerMembershipId,
  setFreezeId,
  setType,
  handleUpdate,
}) {
  const { user } = useContext(MainContext);
  let discount = (membership.discount_in_percent * membership.price) / 100;
  const totalDays = moment(membership.end_date).diff(
    moment(membership.start_date),
    "days",
  );
  const daysLeft = moment(membership.end_date).diff(moment(), "days");
  const daysCompleted = totalDays - daysLeft;
  const daysPrgress = (daysCompleted * totalDays) / 100;

  let isFreezePeriod = moment().isBefore(membership.last_freeze.end_date);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white shadow-lg transition-colors",
      )}
    >
      {moment(membership.end_date).isBefore(moment()) && (
        <div className="absolute inset-0 h-full w-full cursor-not-allowed bg-gray-500/80 mix-blend-color" />
      )}
      <div className="bg-primary/10 p-4 text-white">
        <div
          className={cn(
            "my-2 flex items-center justify-center text-xl font-bold text-black",
          )}
        >
          <div className="rounded-full border bg-white p-1 px-2">
            <div className="flex items-center justify-center gap-1">
              <span className="pl-1.5 text-[11px] font-medium text-gray-500">
                Discounted Price
              </span>
              <span className="rounded-full bg-primary px-2 py-1 text-sm font-normal leading-4 text-white">
                {currencyFormatter(membership.price - discount)}
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn("my-2 text-center text-4xl font-bold text-gray-700", {
            "line-through decoration-red-400":
              membership.discount_in_percent > 0,
          })}
        >
          <span className="relative">
            {currencyFormatter(membership.price)}
            <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 text-nowrap rounded-full bg-red-400 px-2 py-0.5 text-[10px] font-medium leading-4 text-white">
              {membership.discount_in_percent}% OFF
            </span>
          </span>
        </div>

        <div
          className={
            "-mb-[26px] text-center font-semibold uppercase text-primary"
          }
        >
          <Badge className={"bg-white shadow-sm"}>{membership.name}</Badge>
        </div>
      </div>

      <div className="relative p-4 pb-0">
        <Muted
          className={
            "my-2 mb-6 rounded-full border py-1 text-center text-xs font-medium capitalize"
          }
        >
          What you will get
        </Muted>
        <ul className="space-y-1">
          <Perk perk={`${membership.duration_in_months} Months`} />
          <Perk
            perk={`${currencyFormatter(
              membership.price / membership.duration_in_months,
            )}
              /month`}
          />
          {membership?.perks?.map((perk, idx) => (
            <Perk key={idx} perk={perk} />
          ))}
        </ul>

        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-end text-xs font-medium">
            <span>Days left: {daysLeft} Days</span>
          </div>
          <Progress className="h-2" value={daysPrgress} />
        </div>
      </div>

      <div className="space-y-2 p-4">
        <Button type="button" className="w-full" variant="outline">
          {moment(membership.end_date).isBefore(moment())
            ? "Expired"
            : "Active plan"}
        </Button>
        {isFreezePeriod && (
          <div className="text-xs">
            <span>Freeze period: </span>
            <span className="text-gray-500">
              {moment(membership.last_freeze.start_date).format("DD MMM YYYY")}{" "}
              To {moment(membership.last_freeze.end_date).format("DD MMM YYYY")}
            </span>
          </div>
        )}
        {user?.role === "sales_person" && (
          <div className="flex gap-1">
            {isFreezePeriod ? (
              <Button
                className="w-full"
                onClick={() =>
                  handleUpdate({
                    end_date: moment().format(),
                    id: membership.last_freeze.id,
                  })
                }
              >
                Unfreeze
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="primary"
                type="button"
                onClick={() => {
                  setType("create");
                  openModal();
                  setCustomerMembershipId(membership.id);
                }}
              >
                Freeze
              </Button>
            )}
            {isFreezePeriod && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setFreezeId(membership?.last_freeze?.id);
                  setType("edit");
                  openModal();
                }}
              >
                <Edit size={15} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Perk({ perk }) {
  return (
    <li className="flex items-center justify-start gap-1">
      <span className="rounded-full bg-primary/10 p-1 text-primary">
        <Check size={10} />
      </span>
      <span className="text-xs font-medium capitalize">{perk}</span>
    </li>
  );
}
