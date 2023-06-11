import Link from "next/link";
import { patchData } from "../utils/fetchData";
import { updateItem } from "../store/Actions";

export default function OrderDetail({ orderDetail, state, dispatch }) {
  const { auth, orders } = state;

  const handleDelivered = (order) => {
    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      const { paid, dateOfPayment, method, delivered } = res.result;

      dispatch(
        updateItem(
          orders,
          order._id,
          {
            ...order,
            paid,
            dateOfPayment,
            method,
            delivered,
          },
          "ADD_ORDERS"
        )
      );

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };
  const handlePayment = (order) => {
    patchData(`order/payment/${order._id}`, null, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch(
        updateItem(
          orders,
          order._id,
          {
            ...order,
          },
          "ADD_ORDERS"
        )
      );

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;
  return (
    <>
      {orderDetail.map((order) => (
        <div
          key={order._id}
          style={{ margin: "20px auto" }}
          className="row justify-content-around"
        >
          <div
            className="text-uppercase my-3 bg-light rounded p-4"
            style={{ maxWidth: "600px" }}
          >
            <h2 className="text-break mb-3">Pesanan {order._id}</h2>

            <div className="mt-2 text-secondary">
              <h3>Pengiriman</h3>
              <p>Nama: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Alamat: {order.address}</p>
              <p>Telepon: {order.mobile}</p>

              <div
                className={`alert ${
                  order.delivered ? "alert-success" : "alert-danger"
                }
                        d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.delivered
                  ? `Deliverd on ${order.updatedAt}`
                  : "Not Delivered"}
                {auth.user.role === "admin" && !order.delivered && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handleDelivered(order)}
                  >
                    Kirim Sekarang
                  </button>
                )}
              </div>
              <div
                className={`alert ${
                  order.paid ? "alert-success" : "alert-danger"
                }
                        d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.paid ? `Payment on ${order.updatedAt}` : "Not Paid"}
                {auth.user.role !== "admin" && !order.paid && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handlePayment(order)}
                  >
                    Bayar Sekarang
                  </button>
                )}
              </div>
              <div>
                <h3>Detail Pesanan</h3>
                {order.cart.map((item) => (
                  <div
                    className="row border-bottom"
                    key={item._id}
                    style={{ maxWidth: "550px" }}
                  >
                    <img
                      src={item.images[0].url}
                      alt={item.images[0].url}
                      style={{
                        width: "50px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />

                    <h5 className="flex-fill text-secondary m-0">
                      <Link href={`/product/${item._id}`}>{item.title}</Link>
                    </h5>

                    <span className="text-primary m-0">
                      {item.quantity} x Rp {item.price} = Rp{" "}
                      {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h4>Total: Rp {order.total}</h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
