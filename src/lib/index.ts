import { writable, type Updater, type StartStopNotifier } from 'svelte/store';

export function broadcastable<T>(name: string, value?: T, start: StartStopNotifier<T> = () => {}) {
	const channel = new BroadcastChannel(name);

	const {
		subscribe: _subscribe,
		set: _set,
		update: _update
	} = writable<T>(value, (set, update) => {
		function messageHandler({ data }: MessageEvent<T>) {
			set(data);
		}
		channel.addEventListener('message', messageHandler);
		const stop = start(set, update);
		return () => {
			channel.removeEventListener('message', messageHandler);
			channel.close();
			if (stop) stop();
		};
	});

	function update(updater: Updater<T>) {
		_update((value) => {
			const newValue = updater(value);
			channel.postMessage(newValue);
			return newValue;
		});
	}

	function set(value: T) {
		channel.postMessage(value);
		_set(value);
	}

	return {
		subscribe: _subscribe,
		set,
		update
	};
}
