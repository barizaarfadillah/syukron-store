import { addToCart } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import Link from "next/link";
import { useContext } from "react";

export default function ProductItem({ product }) {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const adminLink = () => {
    return (
      <>
        <Link
          href={`create/${product._id}`}
          className="btn btn-dark"
          style={{ marginRight: "5px", flex: 1 }}
        >
          Edit
        </Link>
        <button
          className="btn btn-danger"
          style={{ marginLeft: "5px", flex: 1 }}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() =>
            dispatch({
              type: "ADD_MODAL",
              payload: [
                {
                  data: "",
                  id: product._id,
                  title: product.title,
                  type: "DELETE_PRODUCT",
                },
              ],
            })
          }
        >
          Delete
        </button>
      </>
    );
  };
  const userLink = () => {
    return (
      <>
        <Link
          href={`product/${product._id}`}
          className="btn btn-dark"
          style={{ marginRight: "5px", flex: 1 }}
        >
          Lihat
        </Link>
        <button
          className="btn btn-success"
          style={{ marginLeft: "5px", flex: 1 }}
          disabled={product.inStock === 0 ? true : false}
          onClick={() => dispatch(addToCart(product, cart))}
        >
          Beli
        </button>
      </>
    );
  };
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        className="card-img-top"
        src={product.images[0].url}
        alt={product.images[0].url}
      />
      <div className="card-body">
        <h5 className="card-title text-capitalize" title={product.title}>
          {product.title}
        </h5>
        <h6 className="card-title text-capitalize">{product.author}</h6>

        <div className="d-flex justify-content-between">
          <h6 className="text-danger">Rp {product.price}</h6>
          {product.inStock > 0 ? (
            <h6 className="text-danger">Stok: {product.inStock}</h6>
          ) : (
            <h6 className="text-danger">Stok Habis</h6>
          )}
        </div>

        <p className="card-text" title={product.description}>
          {product.description}
        </p>

        <div className="row justify-content-between mx-0">
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
}
