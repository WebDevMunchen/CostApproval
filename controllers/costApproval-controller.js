const CostApproval = require("../models/costApproval-model.js");
const User = require("../models/user-model.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const asyncWrapper = require("../utils/asyncWrapper.js");
const nodemailer = require("nodemailer");

const createNewApproval = asyncWrapper(async (req, res, next) => {
  const {
    typeOfExpense,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    priority,
  } = req.body;

  const creator = req.user;
  console.log(creator);
  let liquidity = false;
  let liquidityStatus;

  if (expenseAmount >= 1500) {
    liquidity = true;
    liquidityStatus = "In Prüfung";
  }

  const newExpense = await CostApproval.create({
    creator: creator.id,
    typeOfExpense,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    liquidity,
    liquidityStatus,
    priority,
  });

  let address = "";

  if (approver === "Ben") {
    address = "denis.hadzipasic@partyrent.com";
  } else if (approver === "Tobias") {
    address = "it.muenchen@partyrent.com";
  } else {
    address = "webdevmuenchen@gmail.com";
  }

  const additionalAddress = liquidity ? "denis.hadzipasic@partyrent.com" : "";

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const formattedCents = expenseAmountCent.toString().padStart(2, "0");
  const formattedAmount = `${expenseAmount},${formattedCents} €`;

  const commonHtmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Es gibt eine neue Anfrage zur Kostenfreigabe:</p>
    <p><strong>Bitte beachten, dass bei diesem Antrag zunächst die Liquidität durch die Buchhaltung geprüft werden muss!</strong></p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; text-align: left;">Feld</th>
          <th style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; text-align: left;">Wert</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Creator</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            creator.firstName
          } ${creator.lastName}</td>
        </tr>
        <tr>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; font-weight: bold;">Art der Kosten</td>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px;">${typeOfExpense}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Titel</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${title}</td>
        </tr>
        <tr>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; font-weight: bold;">Welche Kosten entstehen?</td>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Fälligkeitsdatum</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${deadline}</td>
        </tr>
        <tr>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; font-weight: bold;">Priorität</td>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px;">${priority}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Liqudität</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            liquidity ? "wird benötigt" : "wird nicht benötigt"
          }</td>
        </tr>
      </tbody>
    </table>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; text-align: left;" colspan="2">Was wird benötigt</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;" colspan="2">${additionalMessage}</td>
        </tr>
      </tbody>
    </table>
<div style="text-align: center; margin-top: 20px;">
  <a href="http://localhost:5173/admin/dashboard" style="
    display: inline-block;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    padding: 12px 24px;
    color: #fff;
    text-transform: uppercase;
    border-radius: 8px;
    background-color: #1d4ed8;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    margin-right: 5px;
    text-align: center;
    cursor: pointer;
    width: calc(50% - 10px);
    margin-top: 10px;
    line-height: 1.5;
" onmouseover="this.style.backgroundColor='#1e40af'; this.style.boxShadow='0 6px 8px rgba(0, 0, 0, 0.2)';" onmouseout="this.style.backgroundColor='#1d4ed8'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.1)';">
    Zur Kostenfreigabe
  </a>
</div>

  </div>`;

  const primaryMailOptions = {
    from: {
      name: "Kostenfreigabetool - Training Academy - No reply",
      address: process.env.USER,
    },
    to: address,
    subject: "Kostenfreigabetool - Rent.Group München ",
    text: "Kostenfreigabetool - Rent.Group München",
    html: commonHtmlContent,
  };

  const additionalMailOptions = {
    from: {
      name: "Kostenfreigabetool - Rent.Group München - No reply",
      address: process.env.USER,
    },
    to: additionalAddress,
    subject: "Kostenfreigabetool - Rent.Group München",
    text: "Kostenfreigabetool - Rent.Group München",
    html: commonHtmlContent.replace(
      "<p><strong>Bitte beachten, dass bei diesem Antrag zunächst die Liquidität durch die Buchhaltung geprüft werden muss!</strong></p>",
      "<p><strong>Für diese Anfrage muss zunächst die Liquidität genehmigt werden!</strong></p>"
    ),
  };

  transporter.sendMail(primaryMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending primary email:", error);
    } else {
      console.log("Primary email sent:", info.response);
    }
  });

  if (additionalAddress) {
    transporter.sendMail(additionalMailOptions, (error, info) => {
      if (error) {
        console.error("Error sending additional email:", error);
      } else {
        console.log("Additional email sent:", info.response);
      }
    });
  }

  res.status(201).json(newExpense);
});

const editApproval = asyncWrapper(async (req, res, next) => {
  const {
    typeOfExpense,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    priority,
  } = req.body;
  const { id } = req.params;

  const creator = req.user.id;
  let liquidity = false;
  let liquidityStatus;

  if (expenseAmount >= 1500) {
    liquidity = true;
    liquidityStatus = "In Prüfung";
  } else {
    liquidityStatus = null;
  }

  const newExpense = await CostApproval.findByIdAndUpdate(id, {
    creator,
    typeOfExpense,
    title,
    additionalMessage,
    expenseAmount,
    expenseAmountCent,
    approver,
    deadline,
    liquidity,
    liquidityStatus,
    priority,
  });

  res.status(201).json(newExpense);
});

const deleteApproval = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const approval = await CostApproval.findByIdAndDelete(id);

  if (!approval) {
    throw new ErrorResponse("Approval not found!", 404);
  } else {
    res.json({ message: "Deleted!" });
  }
});

const getUserApprovals = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;

  const approvals = await CostApproval.find({ creator: id })
    .populate("creator")
    .sort({ dateOfCreation: -1 });

  res.json(approvals);
});

const getSingleApproval = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const approval = await CostApproval.findById(id);

  if (!approval) {
    throw new ErrorResponse("Approval not found!", 404);
  } else {
    res.json(approval);
  }
});

const getAllApprovals = asyncWrapper(async (req, res, next) => {
  const { year, status, month, approver } = req.query; // Add approver to query parameters
  const { id: admin_id } = req.user;

  // Fetch the logged-in user's information to get the firstName
  const user = await User.findById(admin_id);
  const userFirstName = user.firstName;

  let query = {};

  if (year) {
    query.year = year;
  }

  if (month) {
    query.month = month;
  }

  if (status) {
    const statuses = status.split(",");
    query.status = { $in: statuses };
  }

  // If an approver is provided in the query, use it. Otherwise, default to the logged-in user's first name.
  if (approver) {
    query.approver = approver;
  }

  const approvals = await CostApproval.find(query).populate("creator");

  res.json(approvals);
});

const getAllLiquidityApprovals = asyncWrapper(async (req, res, next) => {
  const { liquidity } = req.query;
  let query = {};

  // Convert the liquidity query parameter to a boolean if it exists
  if (liquidity !== undefined) {
    query.liquidity = liquidity === "true"; // Convert 'true'/'false' string to boolean
  }

  const approvals = await CostApproval.find(query).populate("creator");

  res.json(approvals);
});

const approveInquiry = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const declineInquiry = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message, declineReason } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    declineReason,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.abbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const setPending = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message, pendingReason } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    pendingReason,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.abbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const approveLiqudity = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const declineLiquidity = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message, liquidityDeclineReason } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    liquidityDeclineReason,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const setLiquidityPending = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message, liquidityPendingReason } = req.body;
  const { id: admin_id } = req.user;

  if (!status || !message) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(admin_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.status = status;
  costApproval.lastUpdate.push({
    message,
    date: currentTime,
    liquidityPendingReason,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

module.exports = {
  createNewApproval,
  getUserApprovals,
  getSingleApproval,
  editApproval,
  deleteApproval,
  getAllApprovals,
  approveInquiry,
  declineInquiry,
  approveLiqudity,
  declineLiquidity,
  getAllLiquidityApprovals,
  setPending,
  setLiquidityPending,
};
