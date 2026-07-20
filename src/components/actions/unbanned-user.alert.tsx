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
import { MonitorDotIcon } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { unbannedUserFn } from "#/services/user.function";

export const UnbannedUserAlert = ({ userId }: { userId: string }) => {
  const unbannedUser = useServerFn(unbannedUserFn);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      toast.promise(
        async () => {
          const res = await unbannedUser({
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
              message: "Berhasil",
              description: message || "Berhasil unblock pengguna",
            };
          },
          error: (e) => {
            return {
              message: "Gagal",
              description: e.message || "Gagal unblock pengguna",
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
        <Button size="icon-xs" variant="destructive" title="Unblock Pengguna">
          <MonitorDotIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu sangat yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah kamu yakin ingin unblock akun pengguna ini?
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
