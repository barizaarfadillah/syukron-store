import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import Toast from "./Toast";

const Notify = () => {
  const { state, dispatch } = useContext(DataContext);
  const { notify } = state;

  return (
    <>
      {notify.error && (
        <Toast
          msg={{ msg: notify.error, title: "Error" }}
          handleShow={() => dispatch({ type: "NOTIFY", payload: {} })}
          bgColor="bg-danger"
        />
      )}

      {notify.success && (
        <Toast
          msg={{ msg: notify.success, title: "Success" }}
          handleShow={() => dispatch({ type: "NOTIFY", payload: {} })}
          bgColor="bg-success"
        />
      )}
    </>
  );
};

export default Notify;
