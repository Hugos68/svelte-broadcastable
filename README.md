# svelte-broadcastable

Svelte broadcastable is a store wrapper for the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API). It syncs any data across a given channel.

https://github.com/Hugos68/svelte-broadcastable/assets/63101006/74d205be-eeb6-40da-b778-7ca9c43c2666

## Usage

You can import the broadcastable store like so:

```js
import { broadcastable } from 'svelte-broadcastable';
```

You can use the store like this:

```js
const init = 'hello';

const store = broadcastable('my-channel', init);
```

The API is identical to the svelte `writable` store except that it adds 1 parameter called `name`, this will be the name that is used to instantiate the BroadcastChannel, this allows for using multiple channels when sharing state.
