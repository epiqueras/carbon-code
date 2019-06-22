import ReactIframeResizerSuper from 'react-iframe-resizer-super';

const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { useRef, useMemo, useEffect } = wp.element;

const iframes = [];
window.setInterval( () => {
	for ( const iframe of iframes ) {
		if ( window.document.activeElement === iframe ) {
			iframe.dispatchEvent( new window.FocusEvent( 'focus', { bubbles: true } ) );
			break;
		}
	}
}, 500 );

registerBlockType( 'carbon-code/carbon-code', {
	title: __( 'Carbon Code' ),
	category: 'formatting',
	icon: 'media-code',
	keywords: [ __( 'code' ), __( 'carbon' ) ],

	attributes: {
		exportHeight: { type: 'number' },
		locationSearch: { type: 'string' },
	},

	edit: ( { attributes: { exportHeight, locationSearch }, setAttributes } ) => {
		const ref = useRef();
		const { style, src, iframeResizerOptions } = useMemo(
			() => ( {
				style: {
					height: exportHeight ? Math.max( 480, exportHeight + 90 ) : 480,
				},
				src: `https://carbon.epiqueras.now.sh${ locationSearch || '' }`,
				iframeResizerOptions: { checkOrigin: false },
			} ),
			[]
		);
		useEffect( () => {
			const messageListener = message => {
				if ( message.source === ref.current.refs.frame.contentWindow ) {
					try {
						const {
							exportHeight: newExportHeight,
							locationSearch: newLocationSearch,
						} = JSON.parse( message.data );
						if ( newExportHeight && newLocationSearch ) {
							setAttributes( {
								exportHeight: newExportHeight,
								locationSearch: newLocationSearch,
							} );
						}
					} catch ( _ ) {}
				}
			};
			window.addEventListener( 'message', messageListener );
			iframes.push( ref.current.refs.frame );
			return () => {
				window.removeEventListener( 'message', messageListener );
				iframes.splice( iframes.indexOf( ref.current.refs.frame ), 1 );
			};
		}, [] );
		return (
			<ReactIframeResizerSuper
				ref={ ref }
				style={ style }
				src={ src }
				iframeResizerOptions={ iframeResizerOptions }
			/>
		);
	},

	save: ( { attributes: { exportHeight, locationSearch } } ) => (
		<ReactIframeResizerSuper
			style={ {
				height: exportHeight || 385,
			} }
			src={ `https://carbon.epiqueras.now.sh/embed${ locationSearch || '' }` }
		/>
	),
} );
