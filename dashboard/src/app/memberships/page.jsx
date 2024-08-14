"use client";

import MyMembershipCard from "@/components/card/my-membership";
import MembershipForm from "@/components/forms/membership";
import Loader from "@/components/loader";
import Modal from "@/components/Modal";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function fetchMemberships() {
  const { data } = await http().get(endpoints.memberships.getAll);
  return data;
}

async function fetchMyMemberships() {
  const { data } = await http().get(endpoints.customerMemberships.getAll);
  return data;
}

async function createMembership(data) {
  return http().post(`${endpoints.memberships.getAll}`, data);
}
async function updateMembership(data) {
  return http().put(`${endpoints.memberships.getAll}/${data.id}`, data);
}

async function deleteMembership(data) {
  return http().delete(`${endpoints.memberships.getAll}/${data.id}`);
}

export default function Page() {
  const queryClient = useQueryClient();
  const [type, setType] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [id, setId] = useState("");

  const { user } = useContext(MainContext);

  const {
    data: memberships,
    isLoading: isMembershipsLoading,
    isFetching: isMembershipsFetching,
  } = useQuery({
    queryKey: ["memberships"],
    queryFn: fetchMemberships,
    enabled: !!(user?.role === "admin"),
  });

  const {
    data: myMemberships,
    isLoading: isMyMembershipLoading,
    isFetching: isMyMembershipsFetching,
  } = useQuery({
    queryKey: ["my-memberships"],
    queryFn: fetchMyMemberships,
    enabled: !!(user?.role === "customer"),
  });

  const openModal = () => {
    setIsModal(true);
  };

  const createMutation = useMutation(createMembership, {
    onSuccess: (data) => {
      toast.success(data?.message ?? "Membership created.");
      queryClient.invalidateQueries(["memberships"]);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });
  const updateMutation = useMutation(updateMembership, {
    onSuccess: (data) => {
      toast.success(data?.message ?? "Membership updated.");
      queryClient.invalidateQueries(["memberships"]);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });

  const deleteMutation = useMutation(deleteMembership, {
    onSuccess: () => {
      toast.success("Membership deleted.");
      queryClient.invalidateQueries(["memberships"]);
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };
  const handleUpdate = async (data) => {
    updateMutation.mutate(data);
  };

  const handleDelete = async (data) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      deleteMutation.mutate(data);
    }
  };

  if (
    (isMembershipsLoading && isMembershipsFetching) ||
    (isMyMembershipLoading && isMyMembershipsFetching)
  )
    return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title text={"Memberships"} />
        {user?.role === "admin" && (
          <Button
            variant="outline"
            onClick={() => {
              setType("create");
              openModal(true);
            }}
          >
            Create
          </Button>
        )}
      </div>

      <div>
        {user?.role === "admin" ? (
          <div>
            <DataTable columns={columns()} data={memberships} />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4">
              {/* membership */}
              {myMemberships?.map(({ perks, membership, id }) => (
                <MyMembershipCard
                  membership={{ ...membership[0], perks }}
                  key={id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal onClose={() => setIsModal(false)} isOpen={isModal}>
        <MembershipForm
          type={type}
          handleCreate={handleCreate}
          id={id}
          handleUpdate={handleUpdate}
        />
      </Modal>
    </div>
  );
}
