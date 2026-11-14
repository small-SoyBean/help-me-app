extends Node

signal message_received(msg_type: String, payload: Variant)
var _callback: JavaScriptObject

func _ready() -> void:
	if OS.has_feature("web"):
		_callback = JavaScriptBridge.create_callback(_on_js_message)
		JavaScriptBridge.get_interface("window").receiveFromReact = _callback
		send("GODOT_READY")

func _on_js_message(args: Array) -> void:
	var parsed = JSON.parse_string(str(args[0]))
	if parsed:
		message_received.emit(parsed.get("type", ""), parsed.get("payload"))

func send(msg_type: String, payload: Dictionary = {}) -> void:
	if OS.has_feature("web"):
		var json := JSON.stringify({"type": msg_type, "payload": payload})
		JavaScriptBridge.eval("window.parent.postMessage(%s, window.location.origin);" % json)