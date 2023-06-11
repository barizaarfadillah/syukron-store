import { DataContext } from "@/store/GlobalState";
import { getData, postData, putData } from "@/utils/fetchData";
import { imageUpload } from "@/utils/imageUpload";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function ProductsManager() {
  const initialState = {
    title: "",
    author: "",
    price: 0,
    inStock: 0,
    description: "",
  };

  const [product, setProduct] = useState(initialState);
  const { title, author, price, inStock, description } = product;

  const [images, setImages] = useState([]);
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        setProduct(res.product);
        setImages(res.product.images);
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [id]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleUploadInput = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];

    if (files.length === 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Files does not exist." },
      });

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = "The largest image size is 1mb");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "Image format is incorrect.");

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });

    if (err) dispatch({ type: "NOTIFY", payload: { error: err } });

    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Select up to 5 images." },
      });
    setImages([...images, ...newImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid." },
      });

    if (
      !title ||
      !author ||
      !price ||
      !inStock ||
      !description ||
      images.length === 0
    )
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Please add all the fields." },
      });

    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await imageUpload(imgNewURL);

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      router.push("/");
    } else {
      res = await postData(
        "product",
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      router.push("/");
    }

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };

  return (
    <div className="container-fluid">
      <div className="products_manager">
        <form className="row my-4 mx-4" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label>Judul Buku</label>
            <input
              type="text"
              name="title"
              value={title}
              placeholder="Title"
              className="d-block w-100 mb-3 p-2"
              onChange={handleChangeInput}
            />

            <label>Penulis</label>
            <input
              type="text"
              name="author"
              value={author}
              placeholder="Author"
              className="d-block w-100 mb-3 p-2"
              onChange={handleChangeInput}
            />

            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="price">Harga</label>
                <input
                  type="number"
                  name="price"
                  value={price}
                  placeholder="Price"
                  className="d-block w-100 mb-3 p-2"
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-sm-6">
                <label htmlFor="price">Stok</label>
                <input
                  type="number"
                  name="inStock"
                  value={inStock}
                  placeholder="inStock"
                  className="d-block w-100 mb-3 p-2"
                  onChange={handleChangeInput}
                />
              </div>
            </div>

            <label>Deskripsi</label>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="6"
              placeholder="Description"
              onChange={handleChangeInput}
              className="d-block mb-3 w-100 p-2"
              value={description}
            />

            <button type="submit" className="fw-medium btn btn-dark my-2 px-4">
              {onEdit ? "Update Product" : "Add New Product"}
            </button>
          </div>

          <div className="col-md-6 my-4">
            <div className="input-group mb-3">
              <input
                type="file"
                className="form-control"
                onChange={handleUploadInput}
                multiple
                accept="image/*"
              />
              <label class="input-group-text" for="inputGroupFile02">
                Upload
              </label>
            </div>

            <div className="row img-up mx-0">
              {images.map((img, index) => (
                <div key={index} className="file_img my-1">
                  <img
                    src={img.url ? img.url : URL.createObjectURL(img)}
                    alt=""
                    className="img-thumbnail rounded"
                  />

                  <span onClick={() => deleteImage(index)}>X</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
