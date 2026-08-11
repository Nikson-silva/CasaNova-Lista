"use client";

type GiftPresentOptionsProps = {
    onSelectPix: () => void;
    onSelectItem?: () => void;
    showItemOption?: boolean;
};

export function GiftPresentOptions({
    onSelectItem,
    onSelectPix,
    showItemOption = true,
}: GiftPresentOptionsProps) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Como deseja nos presentear?</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    Escolha uma das opções abaixo para continuar.
                </p>
            </div>

            <div className="grid gap-3">
                {showItemOption && onSelectItem ? (
                    <button
                        type="button"
                        onClick={onSelectItem}
                        className="flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
                    >
                        <span className="text-2xl" aria-hidden="true">
                            🎁
                        </span>

                        <span>
                            <span className="block font-semibold">Presentear com o item</span>

                            <span className="mt-1 block text-sm text-muted-foreground">
                                Quero comprar este presente para vocês.
                            </span>
                        </span>
                    </button>
                ) : null}

                <button
                    type="button"
                    onClick={onSelectPix}
                    className="flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors hover:border-primary hover:bg-primary/5"
                >
                    <span className="text-2xl" aria-hidden="true">
                        💙
                    </span>

                    <span>
                        <span className="block font-semibold">Presentear via Pix</span>

                        <span className="mt-1 block text-sm text-muted-foreground">
                            Quero enviar o valor deste presente via Pix.
                        </span>
                    </span>
                </button>
            </div>
        </div>
    );
}
