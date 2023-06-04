import CartItem from "@/components/CartItem";
import { DataContext } from "@/store/GlobalState";
import { getData } from "@/utils/fetchData";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Cart() {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(res);
    };

    getTotal();
  }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("__next__cart01__store"));
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`);
          const { _id, title, images, price, inStock, sold } = res.product;
          if (inStock > 0) {
            newArr.push({
              _id,
              title,
              images,
              price,
              inStock,
              sold,
              quantity: item.quantity > inStock ? 1 : item.quantity,
            });
          }
        }

        dispatch({ type: "ADD_CART", payload: newArr });
      };
      updateCart();
    }
  }, []);

  const handlePayment = async () => {
    if (!address || !mobile)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add your address and mobile." },
      });
    else
      return dispatch({
        type: "NOTIFY",
        payload: { success: "Pembayaran Berhasil" },
      });
  };

  if (cart.length === 0) {
    return (
      <div className="container-fluid">
        <div className="my-5 text-center">
          <img
            className="img-fluid rounded mx-auto d-block"
            style={{ width: "200px", height: "200px" }}
            src="/cart.jpg"
            alt="not empty"
          />
          <h5 className="fw-bold">Wah, keranjang belanjamu masih kosong</h5>
          <p className="fw-medium">Yuk, telusuri produk dari Syukron Store</p>
          <Link href={"/"} className="btn btn-dark my-2">
            Belanja Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row mx-auto">
        <div className="col-md-8 text-secondary table-responsive my-4">
          <h2 className="text-uppercase">Keranjang Saya</h2>

          <table className="table my-3">
            <tbody>
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  dispatch={dispatch}
                  cart={cart}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-4 my-4">
          <form>
            <h2 className="text-uppercase">Pengiriman</h2>

            <label htmlFor="address">Alamat</label>
            <input
              type="text"
              name="address"
              id="address"
              className="form-control mb-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label htmlFor="mobile">Telepon</label>
            <input
              type="text"
              name="mobile"
              id="mobile"
              className="form-control mb-2"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </form>

          <h3>
            Total: <span className="text-danger">Rp {total}</span>
          </h3>

          <Link
            href={auth.user ? "#!" : "/login"}
            className="btn btn-dark my-2"
            onClick={handlePayment}
          >
            Bayar
          </Link>
        </div>
      </div>
    </div>
  );
}
