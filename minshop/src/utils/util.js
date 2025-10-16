const util = {
    cleanInput(input) {
        if (typeof input !== "string") return input;
        return input.trim().replace(/[<>]/g, "");
    },

    alertAndRedirect(message, url) {
        alert(message);
        window.location.href = url;
    },

    getCurrentCustomerId() {
        return localStorage.getItem("customer_id") || "default_order";
    },
};

export default util;
