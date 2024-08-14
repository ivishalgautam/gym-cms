"use client";
import Loader from "@/components/loader";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Modal from "@/components/Modal";
import { toast } from "sonner";
import MembershipPerkForm from "@/components/forms/membership-perk";

async function fetchPerks() {
  const { data } = await http().get(endpoints.membershipPerk.getAll);
  return data;
}

async function createPerk(data) {
  return http().post(`${endpoints.membershipPerk.getAll}`, data);
}
async function updatePerk(data) {
  return http().put(`${endpoints.membershipPerk.getAll}/${data.id}`, data);
}

async function deletePerk(data) {
  return http().delete(`${endpoints.membershipPerk.getAll}/${data.id}`);
}

export default function Page() {
  const queryClient = useQueryClient();
  const [type, setType] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [id, setId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["membership-perks"],
    queryFn: fetchPerks,
  });

  const openModal = () => {
    setIsModal(true);
  };

  const createMutation = useMutation(createPerk, {
    onSuccess: (data) => {
      toast.success(data?.message ?? "Perk created.");
      queryClient.invalidateQueries(["membership-perks"]);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });
  const updateMutation = useMutation(updatePerk, {
    onSuccess: (data) => {
      toast.success(data?.message ?? "Perk updated.");
      queryClient.invalidateQueries(["membership-perks"]);
      setIsModal(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "error");
    },
  });

  const deleteMutation = useMutation(deletePerk, {
    onSuccess: () => {
      toast.success("Perk deleted.");
      queryClient.invalidateQueries(["membership-perks"]);
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

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title text={"Membership perks"} />
        <Button
          variant="outline"
          onClick={() => {
            setType("create");
            openModal(true);
          }}
        >
          Create
        </Button>
      </div>

      <div>
        <DataTable
          columns={columns(handleDelete, setId, setType, openModal)}
          data={data}
        />
      </div>

      <Modal onClose={() => setIsModal(false)} isOpen={isModal}>
        <MembershipPerkForm
          type={type}
          handleCreate={handleCreate}
          id={id}
          handleUpdate={handleUpdate}
        />
      </Modal>
    </div>
  );
}
