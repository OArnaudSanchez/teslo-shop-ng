
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
    name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
    transform(value: string | string[]): string {

        if(typeof value === 'string' && value.startsWith('blob:')) return value;

        return !value || value?.length === 0 
            ? './assets/images/no-image.jpg' 
            : this.getFullUrl(value);
    }

    private getFullUrl(value: string | string[]): string{
        let imageUrl = `${environment.API_URL}/files/product`;
        return Array.isArray(value) 
            ? imageUrl.concat(`/${value[0]}`) 
            : imageUrl.concat(`/${value}`);
    }
}