import {
  closeModal,
  openModal,
  setRecipients,
  setSendTo,
  setSubject,
} from '@/features/email-template/slices';
import { useAppDispatch, useAppSelector, type RootState } from '@/store';

export const useEmailModal = () => {
  const dispatch = useAppDispatch();
  const emailState = useAppSelector((state: RootState) => state.email);

  const handleOpenModal = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleSendToChange = (value: string) => {
    dispatch(setSendTo(value));
  };

  const handleSubjectChange = (value: string) => {
    dispatch(setSubject(value));
  };

  const handleRecipientsChange = (recipients: string[]) => {
    dispatch(setRecipients(recipients));
  };

  const handleSendEmail = () => {
    // TODO: integrate with API to send real email
    // For now, just close the modal after simulating send
    // console.log("Sending email...", emailState)
    dispatch(closeModal());
  };

  return {
    ...emailState,
    handleOpenModal,
    handleCloseModal,
    handleSendToChange,
    handleSubjectChange,
    handleRecipientsChange,
    handleSendEmail,
  };
};
