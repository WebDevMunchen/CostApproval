import Sidebar from "../shared/Sidebar";

export default function InquryForm() {
  return (
    <div>
      <div className="flex overflow-hidden bg-white pt-16">
        <Sidebar />
        <div
            
            className="pt-12 h-[100vh] w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
          >
        <div className="shadow rounded-lg px-12 py-8 mx-auto w-full max-w-[750px] bg-white">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Neue Anfrage zur Kostenfreigabe:
              </h1>
          <form className="mt-6">
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="date"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Art der Kosten
                  </label>
                  <select
                    name="date"
                    id="date"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  >
                    <option value={"Bereich"}>Bereich</option>
                    <option value={"Projekt"}>Projekt</option>
                    <option value={"Kontrakt"}>Kontrakt</option>
                  </select>
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="time"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Artbeschreibung
                  </label>
                  <input
                    type="text"
                    name="time"
                    id="time"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    placeholder="Gib eine Artbeschreibung ein"
                  />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="phone"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Was wird benötigt?
              </label>
              <textarea
                name="phone"
                id="phone"
                placeholder="Beschreibe deinen Bedarf..."
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="date"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Welche Kosten entstehen?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="date"
                      id="date"
                      className="w-2/3 rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="€"
                    />
                    <span className="mt-6">,</span>
                    <input
                      type="number"
                      name="date"
                      id="date"
                      className="w-1/3 rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      placeholder="Cent"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="time"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Wer soll die Kosten genehmigen?
                  </label>
                  <select
                    name="time"
                    id="time"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    placeholder="Gib eine Artbeschreibung ein"
                  >
                    <option value={"Ben"}>Ben</option>
                    <option value={"Tobias"}>Tobias</option>
                    <option value={"Sandra"}>Sandra</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex items-center">
                <label className="mb-5 text-base font-semibold text-[#07074D] sm:text-xl">
                  Anhänge
                </label>
                <span className="mb-5 ml-2 text-md font-semibold text-gray-400">
                  {`(Nicht erforderlich)`}:
                </span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <label
                  htmlFor="file"
                  className="flex bg-gray-800 hover:bg-gray-700 text-white text-base px-6 py-3 outline-none rounded w-max cursor-pointer font-[sans-serif]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 mr-2 fill-white inline"
                    viewBox="0 0 32 32"
                  >
                    <path
                      d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                      data-original="#000000"
                    />
                    <path
                      d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                      data-original="#000000"
                    />
                  </svg>
                  Datei auswählen
                  <input type="file" id="file" className="hidden" />
                </label>
                <span className="block text-base font-medium text-[#07074D]">
                  Datei erfolgreich hochgeladen
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
                {/* <span className="block text-base font-medium text-[#07074D]">Noch keine Datei ausgewählt</span>
                    
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-8 text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                      />
                    </svg> */}
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="time"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Priorität:
                  </label>
                  <select
                    name="time"
                    id="time"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base text-lg font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  >
                    <option value={"Dringend"}>Dringend</option>
                    <option value={"Mittel"}>Mittel</option>
                    <option value={"Kann warten"}>Kann warten</option>
                  </select>
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <label
                    htmlFor="date"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Ich brauche eine Antwort bis:
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                </div>
              </div>
            </div>

            <div>
              <button className="bg-gradient-to-b from-gray-700 to-gray-900 text-lg font-medium p-2 mt-2 md:pd-2 text-white uppercase w-full rounded cursor-pointer hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                ÜBERMITTELN
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
