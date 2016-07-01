module.exports = {
  tmi_options: {
    options: {
      debug: true
    },
    connection: {
      reconnect: true
    },
    identity: {
      username: "username",
      password: "oauth:token"
    },
    channels: ["#username"],
    channel_name: "username"
  }
}
