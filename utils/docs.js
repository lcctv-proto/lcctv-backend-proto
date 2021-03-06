const routes = [
    {
        base: "/api/accounts",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) accounts.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) accounts with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) accounts with custom id(prefix + acc_ctr) that matches the prefix and acc_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: [
                    "accountName - object",
                    "additionalInfo - object",
                    "serviceAddress - object",
                    "contactInfo - object",
                    "packageID - id",
                    "governmentIdImageURL - string",
                    "billingImageURL - string",
                ],
                desc: "Creates an account. Checks DB if a package with _id that matches packageID exists first before saving account to DB.",
            },
            {
                route: "/:id",
                method: "PUT",
                body: [
                    "accountName - object",
                    "additionalInfo - object",
                    "contactInfo - object",
                ],
                desc: "Updates an account's accountName, additionalInfo, contactInfo. Checks DB if account with _id that matches :id exists first before saving account update to DB.",
            },
            {
                route: "/package/:id",
                method: "PATCH",
                body: ["packageID - id"],
                desc: "Updates an account's package. Checks DB if account with _id that matches :id exists first and if a package with _id that matches packageID exists before saving account update to DB.",
            },
            {
                route: "/status/:id",
                method: "PATCH",
                body: ["accountStatus - string"],
                desc: "Updates an account's accountStatus. Checks DB if account with _id that matches :id exists first before saving account update to DB.",
            },
            {
                route: "/address/:id",
                method: "PATCH",
                body: ["serviceAddress - object"],
                desc: "Updates an account's serviceAddress. Checks DB if account with _id that matches :id exists first before saving account update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an account. Checks DB if account with _id that matches :id exists first before saving account deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an account. Checks DB if account with _id that matches :id exists first before saving account deletion to DB.",
            },
        ],
    },
    {
        base: "/api/applications",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) applications.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) applications with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) applications with custom id(prefix + app_ctr) that matches the prefix and app_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: ["remarks - string", "accountID - id"],
                desc: "Creates an application. Checks DB if an account with _id that matches accountID exists first before saving application to DB.",
            },
            {
                route: "/status/:id",
                method: "PATCH",
                body: ["status - string", "step - number"],
                desc: "Updates an applications' status and step. Checks DB if application with _id that matches :id exists first before saving application update to DB.",
            },
            {
                route: "/account/:id",
                method: "PATCH",
                body: ["accountID - id"],
                desc: "Updates an applications' accountID. Checks DB if application with _id that matches :id exists and first and if a account with _id that matches accountID exists before saving application update to DB.",
            },
            {
                route: "/remarks/:id",
                method: "PATCH",
                body: ["remarks - string"],
                desc: "Updates an applications' remarks. Checks DB if applications with _id that matches :id exists first before saving applications update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an application. Checks DB if application with _id that matches :id exists first before saving application deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an application. Checks DB if application with _id that matches :id exists first before saving application deletion to DB.",
            },
        ],
    },
    {
        base: "/api/areas",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) areas.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) areas with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) areas with custom id(prefix + area_ctr) that matches the prefix and area_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: ["description - string", "imageURL - string"],
                desc: "Creates an area. Saves created area instantly to DB.",
            },
            {
                route: "/:id",
                method: "PUT",
                body: ["description - string", "imageURL - string"],
                desc: "Updates an area's description and imageURL. Checks DB if area with _id that matches :id exists first before saving area update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an area. Checks DB if area with _id that matches :id exists first before saving area deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an area. Checks DB if area with _id that matches :id exists first before saving area deletion to DB.",
            },
        ],
    },
    {
        base: "/api/channels",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) channels.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) channels with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) channels with custom id(prefix + cha_ctr) that matches the prefix and cha_ctr in the request URL.",
            },
            {
                route: "/packages/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) channels where an package in packages with _id matches :id. Checks DB if packages with _id that matches :id exists first before filtering channels",
            },
            {
                route: "/",
                method: "POST",
                body: [
                    "description - string",
                    "assignedNumber - string",
                    "label - string",
                    "bannerImageURL - string",
                    "videoURL - string",
                    "channelImages - string",
                    "packages - array of IDs",
                ],
                desc: "Creates a channel. Saves created channel instantly to DB.",
            },
            {
                route: "/:id",
                method: "PUT",
                body: [
                    "description - string",
                    "assignedNumber - string",
                    "label - string",
                    "bannerImageURL - string",
                    "videoURL - string",
                    "channelImages - string",
                ],
                desc: "Updates an channel's description, assignedNumber, label, bannerImageURL, videoURL, and channelImages. Checks DB if channel with _id that matches :id exists first before saving channel update to DB.",
            },
            {
                route: "/packages/:id",
                method: "PATCH",
                body: ["packages - array of IDs"],
                desc: "Updates an channel's packages. Checks DB if channel with _id that matches :id exists first before saving channel update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an channel. Checks DB if channel with _id that matches :id exists first before saving channel deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an channel. Checks DB if channel with _id that matches :id exists first before saving channel deletion to DB.",
            },
        ],
    },
    {
        base: "/api/equipments",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) equipments.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) equipments with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) equipments with custom id(prefix + eqpmnt_ctr) that matches the prefix and eqpmnt_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: [
                    "description - string",
                    "label - string",
                    "price - number",
                ],
                desc: "Creates a equipment. Saves created equipment instantly to DB.",
            },
            {
                route: "/:id",
                method: "PUT",
                body: [
                    "description - string",
                    "label - string",
                    "price - number",
                ],
                desc: "Updates an equipment's description, label, and price. Checks DB if equipment with _id that matches :id exists first before saving equipment update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an equipment. Checks DB if equipment with _id that matches :id exists first before saving equipment deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an equipment. Checks DB if equipment with _id that matches :id exists first before saving equipment deletion to DB.",
            },
        ],
    },
    {
        base: "/api/fees",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) fees.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) fees with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) fees with custom id(prefix + fee_ctr) that matches the prefix and fee_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: ["description - string", "price - number"],
                desc: "Creates a fee. Saves created fee instantly to DB.",
            },
            {
                route: "/:id",
                method: "PUT",
                body: ["description - string", "price - number"],
                desc: "Updates an fee's description, and price. Checks DB if fee with _id that matches :id exists first before saving fee update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an fee. Checks DB if fee with _id that matches :id exists first before saving fee deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an fee. Checks DB if fee with _id that matches :id exists first before saving fee deletion to DB.",
            },
        ],
    },
    {
        base: "/api/inquiries",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) inquiries.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) inquiries with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) inquiries with custom id(prefix + inq_ctr) that matches the prefix and inq_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: [
                    "contactNumber - string",
                    "email - string",
                    "type - string",
                    "description - string",
                    "accountID - id",
                ],
                desc: "Creates a inquiry. Checks DB if an account with _id that matches accountID exists first before saving inquiry to DB.",
            },
            {
                route: "/status/:id",
                method: "PATCH",
                body: ["status - string"],
                desc: "Updates an inquiry's status. Checks DB if inquiry with _id that matches :id exists first before saving inquiry update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an inquiry. Checks DB if inquiry with _id that matches :id exists first before saving inquiry deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an inquiry. Checks DB if inquiry with _id that matches :id exists first before saving inquiry deletion to DB.",
            },
        ],
    },
    {
        base: "/api/invoices",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) invoices.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) invoices with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) invoices with custom id(prefix + inv_ctr) that matches the prefix and inv_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: ["amountDue - number", "accountID - id"],
                desc: "Creates a invoice. Checks DB if an account with _id that matches accountID exists first before saving invoice to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an invoice. Checks DB if invoice with _id that matches :id exists first before saving invoice deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an invoice. Checks DB if invoice with _id that matches :id exists first before saving invoice deletion to DB.",
            },
        ],
    },
    {
        base: "/api/jo",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) job orders.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) job orders with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) job orders with custom id(prefix + jo_ctr) that matches the prefix and jo_ctr in the request URL.",
            },
            {
                route: "/installation",
                method: "POST",
                body: [
                    "remarks - string",
                    "applicationID - id",
                    "accountID - id",
                ],
                desc: "Creates a installation-type job order. Checks DB if an application with _id that matches applicationID and account with _id that matches accountID exists first before saving job order to DB.",
            },
            {
                route: "/maintenance",
                method: "POST",
                body: ["remarks - string", "inquiryID - id", "accountID - id"],
                desc: "Creates a maintenance-type job order. Checks DB if an inquiry with _id that matches inquiryID and account with _id that matches accountID exists first before saving job orders to DB.",
            },
            {
                route: "/team/:id",
                method: "PATCH",
                body: [
                    "jobDate - date",
                    "status - string",
                    "branch - string",
                    "teamID - id",
                ],
                desc: "Updates a  job order's jobDate, status, branch, and teamID. Checks DB if a team with _id that matches teamID and job order with _id that matches :id exists first before saving job order update to DB.",
            },
            {
                route: "/equipment/:id",
                method: "PATCH",
                body: ["equipmentsUsed - array of IDs"],
                desc: "Updates a  job order's equipmentsUsed. Checks DB if a job order with _id that matches :id exists first before saving job order update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an job order. Checks DB if job order with _id that matches :id exists first before saving job order deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an job order. Checks DB if job order with _id that matches :id exists first before saving job order deletion to DB.",
            },
        ],
    },
    {
        base: "/api/packages",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) packages.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) packages with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) packages with custom id(prefix + pkg_ctr) that matches the prefix and pkg_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: ["description - string", "price - number"],
                desc: "Creates a package. Saves created package instantly to DB.",
            },
            {
                route: "/:id",
                method: "PUT",
                body: ["description - string", "price - number"],
                desc: "Updates an package's description, and price. Checks DB if package with _id that matches :id exists first before saving package update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an package. Checks DB if package with _id that matches :id exists first before saving package deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an package. Checks DB if package with _id that matches :id exists first before saving package deletion to DB.",
            },
        ],
    },
    {
        base: "/api/payments",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) payments.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) payments with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) payments with custom id(prefix + pkg_ctr) that matches the prefix and pkg_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: [
                    "feeIDs - array of IDs",
                    "amountPaid - number",
                    "dateIssued - date",
                    "receiptNumber - number",
                    "referenceNumber - number",
                    "modeOfPayment - string",
                    "issuingBank - string",
                    "checkNumber - string",
                    "checkAmount - number",
                    "accountID - id",
                    "remarks - string",
                ],
                desc: "Creates a payment. Checks DB if an account with _id that matches accountID exists first before saving payment to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an payment. Checks DB if payment with _id that matches :id exists first before saving payment deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an payment. Checks DB if payment with _id that matches :id exists first before saving payment deletion to DB.",
            },
        ],
    },
    {
        base: "/api/personnel",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) personnel.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) personnel with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) personnel with custom id(prefix + pkg_ctr) that matches the prefix and pkg_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: [
                    "personnelName - object",
                    "contactNumber - string",
                    "roleID - id",
                ],
                desc: "Creates a personnel. Checks DB if a role with _id that matches roleID exists first before saving payment to DB.",
            },
            {
                route: "/register/:id",
                method: "POST",
                body: ["username - string", "password - string"],
                desc: "Updates a personnel's login details. Checks DB if a personnel with _id that matches :id exists first before saving personnel update to DB.",
            },
            {
                route: "/login",
                method: "POST",
                body: ["username - string", "password - string"],
                desc: "Logs in a personnel. Checks DB if a username matches in the list of usernames. Compares passwords and returns success if same and returns failed otherwise.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an personnel. Checks DB if personnel with _id that matches :id exists first before saving personnel deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an personnel. Checks DB if personnel with _id that matches :id exists first before saving personnel deletion to DB.",
            },
        ],
    },
    {
        base: "/api/roles",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) roles.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) roles with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) roles with custom id(prefix + pkg_ctr) that matches the prefix and pkg_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: ["description - string"],
                desc: "Creates a role. Saves created role instantly to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an role. Checks DB if role with _id that matches :id exists first before saving role deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an role. Checks DB if role with _id that matches :id exists first before saving role deletion to DB.",
            },
        ],
    },
    {
        base: "/api/teams",
        endpoints: [
            {
                route: "/",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) teams.",
            },
            {
                route: "/:id",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) teams with _id that matches :id.",
            },
            {
                route: "/:id?type=custom",
                method: "GET",
                body: [],
                desc: "Returns all active(non-deleted) teams with custom id(prefix + pkg_ctr) that matches the prefix and pkg_ctr in the request URL.",
            },
            {
                route: "/",
                method: "POST",
                body: ["description - string", "areaID - id"],
                desc: "Creates a team. Checks DB if an area with _id that matches areaID exists first before saving team to DB.",
            },
            {
                route: "/installations/:id",
                method: "PATCH",
                body: [],
                desc: "Increments an team's installation. Checks DB if team with _id that matches :id exists first before saving team update to DB.",
            },
            {
                route: "/personnel/:id",
                method: "PATCH",
                body: ["personnelIDs - array of IDs"],
                desc: "Updates an team's personnelIDs. Checks DB if team with _id that matches :id exists first before saving team update to DB.",
            },
            {
                route: "/:id",
                method: "DELETE",
                body: [],
                desc: "Soft deletes an team. Checks DB if team with _id that matches :id exists first before saving team deletion to DB.",
            },
            {
                route: "/hard/:id",
                method: "DELETE",
                body: [],
                desc: "Hard deletes an team. Checks DB if team with _id that matches :id exists first before saving team deletion to DB.",
            },
        ],
    },
];

exports.routes = routes;
