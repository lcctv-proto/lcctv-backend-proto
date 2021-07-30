const getPrefix = (format, string) => {
    const today = new Date();
    const dd = String(today.getUTCDate()).padStart(2, "0");
    const mm = String(today.getUTCMonth() + 1).padStart(2, "0");

    if (format === "yyyymmdd") {
        const yyyy = today.getFullYear();
        const prefix = `${yyyy}${mm}${dd}`;

        return prefix;
    }

    const yy = today.getFullYear().toString().substr(-2);
    const prefix = `${string}${yy}${mm}${dd}`;

    return prefix;
};

exports.getPrefix = getPrefix;
