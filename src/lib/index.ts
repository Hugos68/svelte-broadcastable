import { writable, type Updater, type StartStopNotifier } from 'svelte/store';

export function broadcastable<T>(name: string, value?: T, start: StartStopNotifier<T> = () => {}) {
	let channel: BroadcastChannel | null = null;

	const {
		subscribe: _subscribe,
		set: _set,
		update: _update
	} = writable<T>(value, (set, update) => {
		channel = new BroadcastChannel(name);
		channel.addEventListener('message', ({ data }) => set(data));
		const stop = start(set, update);
		return () => {
			channel?.close();
			if (stop) stop();
		};
	});

	function update(updater: Updater<T>) {
		_update((value) => {
			const newValue = updater(value);
			channel?.postMessage(newValue);
			return newValue;
		});
	}

	function set(value: T) {
		channel?.postMessage(value);
		_set(value);
	}

	return {
		subscribe: _subscribe,
		set,
		update
	};
}
