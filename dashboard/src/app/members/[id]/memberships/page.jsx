"use client";

import MyMembershipCard from "@/components/card/my-membership";
import FreezeMembershipForm from "@/components/forms/freeze-membership";
import Loader from "@/components/loader";
import Modal from "@/components/Modal";
import { H2, Small } from "@/components/ui/typography";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

async function fetchCustomerMemberships(id) {
  const { data } = await http().get(
    `${endpoints.customerMemberships.getAll}/getByCustomerId/${id}`,
  );
  return data;
}

async function freezeMembership(data) {
  return await http().put(
    `${endpoints.customerMemberships.getAll}/freezeMembership/${data.id}`,
    data,
  );
}

async function updateFreezeMembership(data) {
  return await http().put(
    `${endpoints.freezeMemberships.getAll}/${data.id}`,
    data,
  );
}

export default function Page({ params: { id } }) {
  const [isModal, setIsModal] = useState(false);
  const [customerMembershipId, setCustomerMembershipId] = useState("");
  const [freezeId, setFreezeId] = useState("");
  const [type, setType] = useState("");
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }

  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [`memberships-${id}`],
    queryFn: () => fetchCustomerMemberships(id),
    enabled: !!id,
  });

  const freezeMutation = useMutation(freezeMembership, {
    onSuccess: (data) => {
      toast.success(data.message ?? "Created");
      queryClient.invalidateQueries(`memberships-${id}`);
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message ?? "Error");
      closeModal();
    },
  });

  const updateMutation = useMutation(updateFreezeMembership, {
    onSuccess: (data) => {
      toast.success(data.message ?? "Updated");
      queryClient.invalidateQueries(`memberships-${id}`);
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message ?? "Error");
      closeModal();
    },
  });

  const handleCreate = (data) => {
    freezeMutation.mutate(data);
  };

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="space-y-4">
        <H2>Memberships</H2>
        <div>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4">
            {!data?.length && <Small>No memberships found!</Small>}
            {/* membership */}
            {data?.map(({ perks, membership, id, last_freeze }) => (
              <MyMembershipCard
                membership={{ ...membership[0], perks, id, last_freeze }}
                key={id}
                openModal={openModal}
                setCustomerMembershipId={setCustomerMembershipId}
                setFreezeId={setFreezeId}
                setType={setType}
                handleUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModal} onClose={closeModal}>
        <FreezeMembershipForm
          handleCreate={handleCreate}
          customerMembershipId={customerMembershipId}
          freezeId={freezeId}
          type={type}
          handleUpdate={handleUpdate}
        />
      </Modal>
    </>
  );
}
