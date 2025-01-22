import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  Q
from .models import Product_Category_Product_Details,Product_field_Details
from django.db.models import Func, Value


@csrf_exempt   
@require_http_methods(["POST", "OPTIONS", "GET"])
def Product_Category_Product_Details_link(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            # Extract and validate data
            Id = data.get('Id', '')
            Name = data.get('Name', '')
            Uppercase_name = Name.upper()
            normalized_name = Name.replace(" ", "").lower()
            field_Names = data.get('field_Names', '')
            Statusedit = data.get('Statusedit', False)
            created_by = data.get('created_by', '')
      
            if Id:
                if Statusedit:
                    try:
                        Product_instance = Product_Category_Product_Details.objects.get(pk=Id)
                        Product_instance.Status = not Product_instance.Status
                        Product_instance.save()
                        return JsonResponse({'success': 'Product Category status updated successfully'})
                    except Product_Category_Product_Details.DoesNotExist:
                        return JsonResponse({'error': f"No entry found with Product Category Id '{Id}'."}, status=404)
                
              
                 # Update the existing Flaggcolor_Detials object if FlaggId is provided
                try:
                    Product_instance = Product_Category_Product_Details.objects.get(pk=Id)
                except Product_Category_Product_Details.DoesNotExist:
                    return JsonResponse({'error': f"No entry found with FlaggId '{Id}'."}, status=404)
                
                existing_category = Product_Category_Product_Details.objects.annotate(
                    normalized_name=Func(
                        'ProductCategory_Name',
                        function='LOWER',
                        template="REPLACE(%(expressions)s, ' ', '')"
                    )
                ).filter(normalized_name=normalized_name).exclude(pk=Id)
                # Check if the new FlaggName exists with a different FlaggColor or vice versa
                if existing_category.exists():
                    return JsonResponse({'warn': f"A Product Category Name '{Name}' already exists"})
                   
                # Update the Flagg Name and/or Flagg Color
                Product_instance.ProductCategory_Name = Uppercase_name
                Product_instance.save()
                if field_Names:
                    field_Names_list = field_Names.split(',')
                    fields = Product_field_Details.objects.filter(pk__in = field_Names_list)
                    Product_instance.Product_fields.set(fields)

                return JsonResponse({'success': 'Product Category updated successfully'})
            else:
                existing_category = Product_Category_Product_Details.objects.annotate(
                    normalized_name=Func(
                        'ProductCategory_Name',
                        function='LOWER',
                        template="REPLACE(%(expressions)s, ' ', '')"
                    )
                ).filter(normalized_name=normalized_name)
                if existing_category.exists():
                    return JsonResponse({'warn': f"A Product Category '{Name}' already exists "})
                    
                # Create a new entry if it does not exist
                Product_instance = Product_Category_Product_Details(
                    ProductCategory_Name=Uppercase_name,
                    Created_by=created_by
                )
                Product_instance.save()
                if field_Names:
                    field_Names_list = field_Names.split(',')
                    print(field_Names_list)
                    convertedfields = [int(f) for f in field_Names_list]
                    fields = Product_field_Details.objects.filter(pk__in = convertedfields)
                    Product_instance.Product_fields.set(fields)

                
                return JsonResponse({'success': 'Product Category added successfully'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)
        
    elif request.method == 'GET':
        try:
            Id = request.GET.get('Id')
            if not Id:
                # Fetch all records from the LocationName model
                Product_instance = Product_Category_Product_Details.objects.all()
                
                # Construct a list of dictionaries containing location data
                Product_instance_data = []
                for product in Product_instance:
                    product_dict = {
                        'id': product.pk,
                        'ProductCategory': product.ProductCategory_Name,
                        'Status':'Active' if product.Status else 'Inactive',
                    }
                    Product_instance_data.append(product_dict)

                return JsonResponse(Product_instance_data, safe=False)
            else:
                Product_instance =Product_Category_Product_Details.objects.get(pk = Id)
                if Product_instance:
                    fileds = Product_field_Details.objects.filter(Status = True)

                    # Prepare data as a list of dictionaries
                    product_data = {
                        'id':Product_instance.pk,
                        'Name':Product_instance.ProductCategory_Name,
                        'fileds_data':[]
                    }
                    product_field_pks = Product_instance.Product_fields.values_list('pk', flat=True)
                    for filed in fileds:
                        checked =False
                        if filed.pk in product_field_pks:
                            checked=True
                        data = {
                            'id': filed.pk,
                            'field_Name': filed.field_Name,
                            'checked': checked
                        }
                        product_data['fileds_data'].append(data)
                    
                return JsonResponse(product_data, safe=False)
                
                
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)