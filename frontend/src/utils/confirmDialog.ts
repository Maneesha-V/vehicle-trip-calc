import Swal, { type SweetAlertIcon } from "sweetalert2";

interface ConfirmDialogOptions {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
}

export const confirmDialog = async ({
  title,
  text,
  confirmButtonText = "Yes, delete",
  cancelButtonText = "Cancel",
  icon = "warning",
}: ConfirmDialogOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};