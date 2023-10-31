package tempo

{
  "kind": "TempoDatasource",
  "metadata": {
    "name": "TempoDemo",
  },
  "spec": {
    "default": false,
    "plugin": {
      "kind": "TempoDatasource",
      "spec": {
        "directUrl": "http://localhost:3200"
      }
    }
  }
}