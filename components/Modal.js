import { deleteItem } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { deleteData } from "@/utils/fetchData";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Modal() {
  const { state, dispatch } = useContext(DataContext);
  const { modal, auth } = state;

  const router = useRouter();

  const deleteProduct = (item) => {
    deleteData(`product/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return router.push("/");
    });
  };

  const handleSubmit = () => {
    if (modal.length !== 0) {
      for (const item of modal) {
        if (item.type === "ADD_CART") {
          dispatch(deleteItem(item.data, item.id, item.type));
        }

        if (item.type === "ADD_USERS") deleteUser(item);

        if (item.type === "DELETE_PRODUCT") deleteProduct(item);

        dispatch({ type: "ADD_MODAL", payload: [] });
      }
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-dark">
            <h5
              className="modal-title text-capitalize text-white"
              id="exampleModalLabel"
            >
              {modal.length !== 0 && modal[0].title}
            </h5>
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            Apakah Anda ingin menghapus item ini?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success"
              data-bs-dismiss="modal"
              onClick={handleSubmit}
            >
              Iya
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
