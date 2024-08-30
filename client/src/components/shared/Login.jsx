import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user } = useContext(AuthContext);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (user && window.location.pathname === "/") {
  //     if (user?.role !== "user") {
  //       navigate("/admin/dashboard");
  //     } else {
  //       navigate("/meineAnfragen");
  //     }
  //   } else {
  //     return;
  //   }
  // }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data);
  };
  return (
    <>
      <div className="pt-28 h-fit bg-gray-50 relative overflow-y-auto lg:ml-64">
        <div className="flex justify-center items-center h-1/5 bg-cover bg-center ml-auto mr-auto lg:w-3/12 mt-0 mb-4">
          <img
            src="https://d2nk66epwbpimf.cloudfront.net/images/345249fd-0959-4762-bfbc-80ca4247abbb/54ad38e7-f4b4-4dc6-9e80-21e06958a192.png"
            alt="logo"
          />
        </div>

        <section>
          <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="font-anek text-md font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                  Melde dich hier mit deinem Konto an:
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <label
                      htmlFor="abbreviation"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Kürzel:
                    </label>
                    <input
                      {...register("abbreviation")}
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Gib dein Kürzel ein..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Kennwort:
                    </label>
                    <input
                      {...register("password", { required: true })}
                      type="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="submit"
                      className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 mt-2 md:p-2 text-white uppercase w-1/2 rounded cursor-pointer hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                      value={"Anmelden"}
                    />
                  </div>
                </form>
                <div className="flex items-center justify-center">
                  <div>
                    <button
                      // onClick={forgotPassword}
                      className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 mr-auto ml-auto"
                    >
                      Kennwort vergessen?
                    </button>
                  </div>
                </div>
                <dialog id="forgotPassword" className="modal">
                  <div className="modal-box">
                    <div
                      className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
                      role="alert"
                    >
                      <div className="flex">
                        <div className="py-1">
                          <svg
                            className="fill-current h-6 w-6 text-teal-500 mr-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold mb-6">Kennwort vergessen?</p>
                          <p className="text-sm mb-6">
                            Um dein Kennwort zurückzusetzen, wende dich bitte an
                            deine Trainings- oder Personalabteilung.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="modal-action flex justify-center">
                      <form method="dialog" className="flex gap-2">
                        <button className="btn w-28">Schließen</button>
                      </form>
                    </div>
                  </div>
                </dialog>

                <dialog id="badCredentials" className="modal">
                  <div className="modal-box">
                    <div className="bg-red-200 px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center justify-center mx-auto">
                      <svg
                        viewBox="0 0 24 24"
                        className="text-red-600 w-5 h-5 sm:w-5 sm:h-5 mr-3"
                      >
                        <path
                          fill="currentColor"
                          d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                        ></path>
                      </svg>
                      <span className="flex justify-center w-full text-red-800 font-bold">
                        {" "}
                        Anmeldung fehlgeschlagen{" "}
                      </span>
                    </div>

                    <div
                      className="bg-red-100 border text-center  border-red-400 text-red-700 px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <span className="block sm:inline">
                        Falsches Kürzel und/oder Kennwort.
                      </span>
                      <br />
                      <span className="block sm:inline">
                        Bitte erneut versuchen.
                      </span>
                    </div>
                    <div className="modal-action flex justify-center">
                      <form method="dialog" className="flex gap-2">
                        <button className="btn w-28">Schließen</button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
