import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { deleteUserFn } from "#/services/user.function";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const DeleteUserDialog = ({ userId }: { userId: string }) => {
  const deleteUser = useServerFn(deleteUserFn);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["users"],
    mutationFn: async ({ id }: { id: string }) => {
      toast.promise(
        async () => {
          const res = await deleteUser({
            data: {
              userId: id,
            },
          });

          if (!res.success) throw new Error(res.message);

          return res;
        },
        {
          loading: "Loading...",
          success: ({ message }) => {
            return {
              message: "Data dihapus",
              description: message || "Data berhasil dihapus",
            };
          },
          error: (e) => {
            return {
              message: "Gagal dihapus",
              description: e.message || "Data gagal dihapus",
            };
          },
          finally: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
        },
      );
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon-xs" variant="destructive">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu sangat yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus
            akun pengguna secara permanen dari server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={() => mutation.mutate({ id: userId })}
          >
            {mutation.isPending ? "Loading..." : "Ya, yakin"}
          </AlertDialogAction>
          <AlertDialogCancel disabled={mutation.isPending}>
            Batal
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
