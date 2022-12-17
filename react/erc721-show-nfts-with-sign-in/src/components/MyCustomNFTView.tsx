import {
  ERC721TokenRenderOptions,
  Media,
  normalizeIpfsUrl,
  Spinner,
} from '.@flair-sdk/react';

type Props = ERC721TokenRenderOptions;

export const MyCustomNFTView = ({
  tokenId,
  tokenUri,
  tokenUriError,
  tokenUriLoading,
  metadata,
  metadataError,
  metadataLoading,
}: Props) => {
  const preferManagedGateway = false;
  // Or base URL to a dedicated gateway e.g:
  // const preferManagedGateway = `https://ipfs.io/ipfs/`;

  return (
    <div className="w-1/4 h-1/4">
      <div className="group aspect-w-10 aspect-h-10 block w-full overflow-hidden rounded-lg bg-neutral-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-neutral-100">
        {metadata?.animation_url || metadata?.image ? (
          <Media
            className="object-cover"
            uri={metadata?.animation_url || metadata?.image}
            preferManagedGateway={preferManagedGateway}
          />
        ) : metadataLoading || tokenUriLoading ? (
          <Spinner />
        ) : (
          <span className="h-full w-full flex items-center justify-center text-lg font-bold text-neutral-200">
            No Media
          </span>
        )}
      </div>
      <div className="mt-2 block truncate text-sm font-medium text-neutral-900">
        {metadata?.name}
      </div>
      <div className="block text-sm font-medium text-neutral-500 flex items-center justify-between px-1">
        <span className="flex gap-2 items-center">
          {tokenUri ? (
            <a
              href={normalizeIpfsUrl(
                tokenUri?.toString(),
                preferManagedGateway,
              )}
              target={'_blank'}
              rel="noreferrer"
            >
              #{tokenId}
            </a>
          ) : (
            <span>#{tokenId}</span>
          )}
        </span>
      </div>
    </div>
  );
};
