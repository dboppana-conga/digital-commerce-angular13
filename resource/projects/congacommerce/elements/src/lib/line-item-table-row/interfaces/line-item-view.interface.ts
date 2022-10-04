export interface CartItemView {
    /**
     * string identifier representing custom display column.
     */
    id: string;
    /**
     * string representing name of cart item field.
     */
    fieldName: string;
    /**
     * cart item field label to be displayed.
     */
    label: string;
    /**
     * number indicates the sequence of cart item field in display column settings.
     */
    sequence: number;
    /**
     * flag indicates whether cart item field is part of user's cart view.
     */
    isSelected: boolean;
    /**
     * flag indicates if the cart item field is configured as editable.
     */
    isEditable: boolean;
}