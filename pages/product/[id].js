import { addToCart } from "@/store/Actions";
import { DataContext } from "@/store/GlobalState";
import { getData } from "@/utils/fetchData";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`product/${id}`);
  return {
    props: { product: res.product },
  };
}
export default function DetailProduct(props) {
  const [product] = useState(props.product);
  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;
  const router = useRouter();
  return (
    <div className="container-fluid">
      <div className="row detail_page">
        <div className="my-4">
          <button className="btn btn-dark" onClick={() => router.back()}>
            <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i>{" "}
            Kembali
          </button>
        </div>
        <div className="col-md-6">
          <img
            src={product.images[0].url}
            alt={product.images[0].url}
            className="d-block img-thumbnail rounded w-100"
            style={{ height: "350px" }}
          />
        </div>
        <div className="col-md-6 ">
          <h2 className="text-uppercase">{product.title}</h2>
          <h4>{product.author}</h4>
          <h5 className="text-danger">Rp {product.price}</h5>

          {product.inStock > 0 ? (
            <h6 className="text-danger">Stok: {product.inStock}</h6>
          ) : (
            <h6 className="text-danger">Stok Habis</h6>
          )}

          <h6 className="text-danger">Terjual: {product.sold}</h6>

          <div className="my-3">{product.description}</div>

          <button
            type="button"
            className="btn btn-dark d-block my-3 px-5"
            onClick={() => dispatch(addToCart(product, cart))}
          >
            Beli
          </button>
        </div>
      </div>
    </div>
  );
}
