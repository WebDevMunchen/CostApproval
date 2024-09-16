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

  let liquidity = false;
  let liquidityStatus;

  if (expenseAmount >= 1500) {
    liquidity = true;
    liquidityStatus = "Neu";
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
    address = "denis.hadzipasic@partyrent.com";
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
  const formattedDeadline = new Date(deadline).toLocaleDateString("de-DE");

  const commonHtmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Es gibt eine neue Anfrage zur Kostenfreigabe:</p>
    <p><strong>Bitte beachten, ob bei dieser Anfrage zunächst die Liquidität durch die Buchhaltung geprüft werden muss!</strong></p>
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
          <td style="border: 1px solid #ddd; padding: 8px;">${formattedDeadline}</td>
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
  <br />

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
    <tr>
      <td align="center" bgcolor="#1d4ed8" style="
        padding: 12px 24px;
        background-color: #1d4ed8;
      ">
        <a 
          href="http://localhost:5173/admin/dashboard" 
          target="_blank" 
          style="
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            text-decoration: none;
            text-transform: uppercase;
            display: inline-block;
          "
        >
          Zur Kostenfreigabe
        </a>
      </td>
    </tr>
  </table>

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
      "<p><strong>Bitte beachten, ob bei dieser Anfrage zunächst die Liquidität durch die Buchhaltung geprüft werden muss!</strong></p>",
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

  const creator = req.user;

  const oldApproval = await CostApproval.findById(id);
  if (!oldApproval) {
    throw new ErrorResponse("Approval not found!", 404);
  }

  let liquidity = false;
  let liquidityStatus;

  if (expenseAmount >= 1500) {
    liquidity = true;
    liquidityStatus = "Neu";
  } else {
    liquidity = false;
    liquidityStatus = null;
  }

  const approval = await CostApproval.findByIdAndUpdate(
    id,
    {
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
    },
    { new: true }
  );

  let address = "";

  if (approval.approver === "Ben") {
    address = "denis.hadzipasic@partyrent.com";
  } else if (approval.approver === "Tobias") {
    address = "denis.hadzipasic@partyrent.com";
  } else {
    address = "webdevmuenchen@gmail.com";
  }

  const additionalAddress = approval.liquidity
    ? "denis.hadzipasic@partyrent.com"
    : "";

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

  const formattedCents = approval.expenseAmountCent.toString().padStart(2, "0");
  const formattedAmount = `${approval.expenseAmount},${formattedCents} €`;
  const formattedDeadline = new Date(approval.deadline).toLocaleDateString(
    "de-DE"
  );

  const oldFormattedAmount = `${
    oldApproval.expenseAmount
  },${oldApproval.expenseAmountCent.toString().padStart(2, "0")} €`;
  const oldFormattedDeadline = new Date(
    oldApproval.deadline
  ).toLocaleDateString("de-DE");

  const commonHtmlContent = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>${creator.firstName} ${
    creator.lastName
  } hat folgende Anfrage zur Kostenfreigabe geändert:</p>
    <p><strong>Bitte beachten, ob bei dieser Anfrage zunächst die Liquidität durch die Buchhaltung geprüft werden muss!</strong></p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;"></th>
          <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Vorher</th>
          <th style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Aktualisiert</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: #f4f4f4;">
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Art der Kosten</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px; ${
            oldApproval.typeOfExpense !== approval.typeOfExpense
              ? "text-decoration: line-through;"
              : ""
          }">${oldApproval.typeOfExpense}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            approval.typeOfExpense
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Artbeschreibung</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px; ${
            oldApproval.title !== approval.title
              ? "text-decoration: line-through;"
              : ""
          }">${oldApproval.title}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            approval.title
          }</td>
        </tr>
        <tr style="background-color: #f4f4f4;">
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Welche Kosten entstehen?</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px; ${
            oldFormattedAmount !== formattedAmount
              ? "text-decoration: line-through;"
              : ""
          }">${oldFormattedAmount}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Fälligkeitsdatum</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px; ${
            oldFormattedDeadline !== formattedDeadline
              ? "text-decoration: line-through;"
              : ""
          }">${oldFormattedDeadline}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${formattedDeadline}</td>
        </tr>
        <tr style="background-color: #f4f4f4;">
          <td style="border: 1px solid #ddd; padding: 8px;"><strong>Priorität</strong></td>
          <td style="border: 1px solid #ddd; padding: 8px; ${
            oldApproval.priority !== approval.priority
              ? "text-decoration: line-through;"
              : ""
          }">${oldApproval.priority}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            approval.priority
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Liquidität</td>
          <td style="border: 1px solid #ddd; padding: 8px; ${
            oldApproval.liquidity !== approval.liquidity
              ? "text-decoration: line-through;"
              : ""
          }">${
    oldApproval.liquidity ? "war benötigt" : "war nicht benötigt"
  }</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            approval.liquidity ? "wird benötigt" : "wird nicht benötigt"
          }</td>
        </tr>
      </tbody>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; text-align: left;" colspan="2">Was wurde benötigt?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;" colspan="2">${
            oldApproval.additionalMessage
          }</td>
        </tr>
      </tbody>
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; text-align: left;" colspan="2">Was wird benötigt?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;" colspan="2">${
            approval.additionalMessage
          }</td>
        </tr>
      </tbody>
    </table>
    <br />

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <td align="center" bgcolor="#1d4ed8" style="
          padding: 12px 24px;
          background-color: #1d4ed8;
        ">
          <a 
            href="http://localhost:5173/admin/dashboard" 
            target="_blank" 
            style="
              font-size: 16px;
              font-weight: bold;
              color: #ffffff;
              text-decoration: none;
              text-transform: uppercase;
              display: inline-block;
            "
          >
            Zur Kostenfreigabe
          </a>
        </td>
      </tr>
    </table>
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

  transporter.sendMail(primaryMailOptions, (error, info) => {
    if (error) {
      console.error("Error sending primary email:", error);
    } else {
      console.log("Primary email sent:", info.response);
    }
  });

  if (additionalAddress) {
    const additionalMailOptions = {
      ...primaryMailOptions,
      to: additionalAddress,
    };

    transporter.sendMail(additionalMailOptions, (error, info) => {
      if (error) {
        console.error("Error sending additional email:", error);
      } else {
        console.log("Additional email sent:", info.response);
      }
    });
  }

  res.status(201).json(approval);
});

const deleteApproval = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const creator = req.user;

  const approval = await CostApproval.findByIdAndDelete(id);

  if (!approval) {
    throw new ErrorResponse("Approval not found!", 404);
  }

  let address = "";

  if (approval.approver === "Ben") {
    address = "denis.hadzipasic@partyrent.com";
  } else if (approval.approver === "Tobias") {
    address = "denis.hadzipasic@partyrent.com";
  } else {
    address = "webdevmuenchen@gmail.com";
  }

  const additionalAddress = approval.liquidity
    ? "denis.hadzipasic@partyrent.com"
    : "";

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

  const formattedCents = approval.expenseAmountCent.toString().padStart(2, "0");
  const formattedAmount = `${approval.expenseAmount},${formattedCents} €`;
  const formattedDeadline = new Date(approval.deadline).toLocaleDateString(
    "de-DE"
  );

  const commonHtmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>${creator.firstName} ${
    creator.lastName
  } hat folgende Anfrage zur Kostenfreigabe gelöscht:</p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Ersteller:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            creator.firstName
          } ${creator.lastName}</td>
        </tr>
        <tr>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; font-weight: bold;">Art der Kosten</td>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px;">${
            approval.typeOfExpense
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Artbeschreibung</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            approval.title
          }</td>
        </tr>
        <tr>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; font-weight: bold;">Welche Kosten entstehen?</td>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Fälligkeitsdatum</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${formattedDeadline}</td>
        </tr>
        <tr>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; font-weight: bold;">Priorität</td>
          <td style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px;">${
            approval.priority
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Liqudität</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            approval.liquidity ? "war benötigt" : "war nicht benötigt"
          }</td>
        </tr>
      </tbody>
    </table>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 8px; text-align: left;" colspan="2">Was wurde benötigt?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;" colspan="2">${
            approval.additionalMessage
          }</td>
        </tr>
      </tbody>
    </table>
  <br />
  </div>`;

  const primaryMailOptions = {
    from: {
      name: "Kostenfreigabetool - Rent.Group München - No reply",
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
    html: commonHtmlContent,
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
  res.json(approval);
});

const getUserApprovals = asyncWrapper(async (req, res, next) => {
  const { id } = req.user;
  const { title, status, year } = req.query;

  const query = { creator: id };

  if (title) {
    query.title = new RegExp(title, "i");
  }

  if (status) {
    query.status = status;
  }

  if (year) {
    query.year = year;
  }

  const approvals = await CostApproval.find(query)
    .populate("creator")
    .sort({ dateOfCreation: -1 });

  res.json(approvals);
});

const updateInquiry = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { updateMessage } = req.body;
  const { id: user_id } = req.user;

  if (!updateMessage) {
    return res.status(400).json({ error: "Status and message are required." });
  }

  const user = await User.findById(user_id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const costApproval = await CostApproval.findById(id);
  if (!costApproval) {
    return res.status(404).json({ error: "Cost approval not found." });
  }

  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 2);

  costApproval.lastUpdate.push({
    updateMessage,
    date: currentTime,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.sendersAbbreviation,
  });

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
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
  const { year, status, month, approver, title } = req.query;
  const { id: admin_id } = req.user;

  const user = await User.findById(admin_id);

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

  if (approver) {
    query.approver = approver;
  }

  if (title) {
    query.title = title;
  }

  const approvals = await CostApproval.find(query).populate("creator");

  res.json(approvals);
});

const getAllLiquidityApprovals = asyncWrapper(async (req, res, next) => {
  const { liquidity, year, liquidityStatus } = req.query;
  let query = {};

  if (liquidity !== undefined) {
    query.liquidity = liquidity === "true";
  }

  if (year) {
    query.year = year;
  }

  if (liquidityStatus) {
    query.liquidityStatus = liquidityStatus;
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

const postponeInquiry = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { status, message, postponeReason } = req.body;
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
    postponeReason,
    sendersFirstName: user.firstName,
    sendersLastName: user.lastName,
    sendersAbbreviation: user.abbreviation,
  });

  console.log(postponeReason);

  const updatedApproval = await costApproval.save();

  res.status(200).json(updatedApproval);
});

const approveLiqudity = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { liquidityStatus, message } = req.body;
  const { id: admin_id } = req.user;

  if (!liquidityStatus || !message) {
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

  costApproval.liquidityStatus = liquidityStatus;
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
  const { liquidityStatus, message, liquidityDeclineReason, status } = req.body;
  const { id: admin_id } = req.user;

  if (!liquidityStatus || !message) {
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

  costApproval.liquidityStatus = liquidityStatus;
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
  const { liquidityStatus, message, liquidityPendingReason } = req.body;
  const { id: admin_id } = req.user;

  if (!liquidityStatus || !message) {
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

  costApproval.liquidityStatus = liquidityStatus;
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
  postponeInquiry,
  updateInquiry
};
