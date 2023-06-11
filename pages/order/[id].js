import OrderDetail from "@/components/OrderDetail";
import { DataContext } from "@/store/GlobalState";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function DetailOrder() {
  const { state, dispatch } = useContext(DataContext);
  const { orders, auth } = state;

  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders]);

  if (!auth.user) return null;
  return (
    <div className="container-fluid">
      <div className="my-3">
        <div>
          <button className="btn btn-dark" onClick={() => router.back()}>
            <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go
            Back
          </button>
        </div>

        <OrderDetail
          orderDetail={orderDetail}
          state={state}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}
