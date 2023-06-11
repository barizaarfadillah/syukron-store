import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { postData } from "../utils/fetchData";
import { DataContext } from "@/store/GlobalState";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Login() {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await postData("auth/login", userData);

    if (res.err)
      return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    dispatch({ type: "NOTIFY", payload: { success: res.msg } });

    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });
    Cookies.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });
    localStorage.setItem("firstLogin", true);
  };
  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/");
  }, [auth]);
  return (
    <div>
      <form
        className="mx-auto my-5"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        <h3 className="fw-bolder text-center">Login</h3>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit" className="btn btn-dark my-3 w-100">
          Login
        </button>

        <p>
          Anda tidak memiliki akun?{" "}
          <Link href="/register" style={{ color: "crimson" }}>
            Daftar Sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}
