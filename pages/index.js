import ProductItem from "@/components/ProductItem";
import { DataContext } from "@/store/GlobalState";
import { getData } from "@/utils/fetchData";
import Link from "next/link";
import { useContext, useState } from "react";

export async function getServerSideProps() {
  const res = await getData("product");
  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}

export default function Home(props) {
  const [products, setProducts] = useState(props.products);
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  return (
    <div className="home_page">
      {auth.user && auth.user.role === "admin" && (
        <div
          className="btn btn-dark mx-4 mt-3"
          style={{ marginBottom: "-10px" }}
        >
          <Link href={`/create`} style={{ marginRight: "5px", flex: 1 }}>
            New Product
          </Link>
        </div>
      )}
      <div className="products">
        {products.length === 0 ? (
          <h2>No Products</h2>
        ) : (
          products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
