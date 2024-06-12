import { useEffect, useState } from "react";

import BackendApi from "@api/BackendApi";
import User from "@interfaces/User";

const GetUsername = (id: number | string) => {
  const storageKey = `user:${id}:username`;
  const [username, setUsername] = useState<User["username"] | null>(
    sessionStorage.getItem(storageKey) ?? null,
  );

  useEffect(() => {
    if (!username) {
      new BackendApi().getUserById(id).then((response) => {
        const user: User = response.data;

        sessionStorage.setItem(storageKey, user.username);

        setUsername(user.username);
      });
    }
  }, [id, storageKey, username]);

  return username;
};

export default GetUsername;
