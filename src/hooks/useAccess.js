export const useAccess = () => {
  const hasAccess = (requiredPrivileges) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userPrivileges = user?.scope?.split(" ") || [];

    if (requiredPrivileges.length === 0) {
      return true;
    }

    const granted = requiredPrivileges.every((priv) =>
      userPrivileges.includes(priv)
    );

    if (!granted) {
      import("react-toastify").then(({ toast }) =>
        toast.error("No access to this action!")
      );
      return false;
    }

    return true;
  };

  return { hasAccess };
};
