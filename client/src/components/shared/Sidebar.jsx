import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function Sidebar() {
  const { logout, user, allApprovalsAdmin, allLiqudityApprovals } =
    useContext(AuthContext);

  let inquiryCount = 0;
  let liquidityCount = 0;

  allApprovalsAdmin?.forEach((element) => {
    if (element.status === "Neu" && element.approver === user.firstName) {
      inquiryCount++;
    } else {
      return;
    }
  });

  allLiqudityApprovals?.forEach((element) => {
    if (element.liquidityStatus === "In Prüfung") {
      liquidityCount++;
    } else {
      return;
    }
  });

  return (
    <aside
      id="sidebar"
      className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-52 transition-width duration-75"
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 mt-2 px-2 bg-white divide-y space-y-1">
            {user.role === "user" ? (
              <ul className="space-y-2 pb-2">
                <li>
                  <NavLink
                    to={"/meineAnfragen"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      height="24"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                    >
                      <path d="M0 96C0 60.7 28.7 32 64 32l448 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM128 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm32-128a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm96-248c-13.3 0-24 10.7-24 24s10.7 24 24 24l224 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-224 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l224 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-224 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l224 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-224 0z" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Meine Anfragen
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/neueAnfrage"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      height="24"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                    >
                      <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16s16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0 0-48z" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Neue Anfrage
                    </span>
                  </NavLink>
                </li>
                <li className={user.leadRole[0] === "none" ? "hidden" : "visible"}>
                  <NavLink
                    to={"/kennzahlen/meinBudget"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                      height="24"
                    >
                      <path d="M400 96l0 .7c-5.3-.4-10.6-.7-16-.7L256 96c-16.5 0-32.5 2.1-47.8 6c-.1-2-.2-4-.2-6c0-53 43-96 96-96s96 43 96 96zm-16 32c3.5 0 7 .1 10.4 .3c4.2 .3 8.4 .7 12.6 1.3C424.6 109.1 450.8 96 480 96l11.5 0c10.4 0 18 9.8 15.5 19.9l-13.8 55.2c15.8 14.8 28.7 32.8 37.5 52.9l13.3 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-32 0c-9.1 12.1-19.9 22.9-32 32l0 64c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-128 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-64c-34.9-26.2-58.7-66.3-63.2-112L68 304c-37.6 0-68-30.4-68-68s30.4-68 68-68l4 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-4 0c-11 0-20 9-20 20s9 20 20 20l31.2 0c12.1-59.8 57.7-107.5 116.3-122.8c12.9-3.4 26.5-5.2 40.5-5.2l128 0zm64 136a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Mein Budget
                    </span>
                  </NavLink>
                </li>
                <li className={user.leadRole[0] === "none" ? "hidden" : "visible"}>
                  <NavLink
                    to={"/kennzahlen/meineAntraege"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      height="24"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                    >
                      <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM112 256l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>

                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Meine Einträge
                    </span>
                  </NavLink>
                </li>
                <li className={user.leadRole[0] === "none" ? "hidden" : "visible"}>
                  <NavLink
                    to={"/kennzahlen/neuerAntrag"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      height="24"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                    >
                      <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Neuer Eintrag
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => logout()}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      height="24"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                    >
                      <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Abmelden
                    </span>
                  </NavLink>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 pb-2">
                <li>
                  <NavLink
                    to={"/admin/dashboard"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg flex items-center p-2 hover:bg-gray-100 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      height="24"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                    >
                      <path d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z" />
                    </svg>
                    <span className="ml-3">Übersicht Intern</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/admin/dashboardKennzahlen"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg flex items-center px-1 py-2 hover:bg-gray-100 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      height="24"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                    >
                      <path d="M304 240l0-223.4c0-9 7-16.6 16-16.6C443.7 0 544 100.3 544 224c0 9-7.6 16-16.6 16L304 240zM32 272C32 150.7 122.1 50.3 239 34.3c9.2-1.3 17 6.1 17 15.4L256 288 412.5 444.5c6.7 6.7 6.2 17.7-1.5 23.1C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272zm526.4 16c9.3 0 16.6 7.8 15.4 17c-7.7 55.9-34.6 105.6-73.9 142.3c-6 5.6-15.4 5.2-21.2-.7L320 288l238.4 0z" />
                    </svg>
                    <span className="ml-3">Übersicht Kennzahlen</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/admin/kostenanfragen"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200 ml-1"
                      height="24"
                    >
                      <path d="M48.1 240c-.1 2.7-.1 5.3-.1 8l0 16c0 2.7 0 5.3 .1 8L32 272c-17.7 0-32 14.3-32 32s14.3 32 32 32l28.3 0C89.9 419.9 170 480 264 480l24 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-24 0c-57.9 0-108.2-32.4-133.9-80L256 336c17.7 0 32-14.3 32-32s-14.3-32-32-32l-143.8 0c-.1-2.6-.2-5.3-.2-8l0-16c0-2.7 .1-5.4 .2-8L256 240c17.7 0 32-14.3 32-32s-14.3-32-32-32l-125.9 0c25.7-47.6 76-80 133.9-80l24 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-24 0C170 32 89.9 92.1 60.3 176L32 176c-17.7 0-32 14.3-32 32s14.3 32 32 32l16.1 0z" />
                    </svg>
                    <span className="ml-5 flex-1 whitespace-nowrap">
                      Kostenanfragen
                    </span>
                    <span className="bg-blue-200 text-blue-800 ml-3 text-sm font-medium inline-flex items-center justify-center px-2 rounded-full">
                      {inquiryCount}
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/admin/liquidity"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                      className="overflow-visible fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                      height="24"
                    >
                      <path d="M512 80c8.8 0 16 7.2 16 16l0 32L48 128l0-32c0-8.8 7.2-16 16-16l448 0zm16 144l0 192c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-192 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z" />
                    </svg>
                    <span className="ml-6 flex-1 whitespace-nowrap">
                      Liquidität
                    </span>
                    <span className="bg-red-200 text-red-800 ml-3 text-sm font-medium inline-flex items-center justify-center px-2 rounded-full">
                      {liquidityCount}
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={"/admin/budgetVerwaltenIntern"}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                      height="24"
                    >
                      <path d="M400 96l0 .7c-5.3-.4-10.6-.7-16-.7L256 96c-16.5 0-32.5 2.1-47.8 6c-.1-2-.2-4-.2-6c0-53 43-96 96-96s96 43 96 96zm-16 32c3.5 0 7 .1 10.4 .3c4.2 .3 8.4 .7 12.6 1.3C424.6 109.1 450.8 96 480 96l11.5 0c10.4 0 18 9.8 15.5 19.9l-13.8 55.2c15.8 14.8 28.7 32.8 37.5 52.9l13.3 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-32 0c-9.1 12.1-19.9 22.9-32 32l0 64c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-128 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-64c-34.9-26.2-58.7-66.3-63.2-112L68 304c-37.6 0-68-30.4-68-68s30.4-68 68-68l4 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-4 0c-11 0-20 9-20 20s9 20 20 20l31.2 0c12.1-59.8 57.7-107.5 116.3-122.8c12.9-3.4 26.5-5.2 40.5-5.2l128 0zm64 136a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                      Budget
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => logout()}
                    className="text-[14px] text-gray-900 font-semibold rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      height="24"
                      className="fill-gray-500 group-hover:fill-slate-950 transition-colors duration-200"
                    >
                      <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 224c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z" />
                    </svg>
                    <span className="ml-4 flex-1 whitespace-nowrap">
                      Abmelden
                    </span>
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
