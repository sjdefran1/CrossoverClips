import pymongo
from db.get_database import get_db_client_connection


# Quick client getter helpers
# -----------------------------------------------
def get_production_client() -> pymongo.MongoClient:
    return get_db_client_connection()

def get_test_client() -> pymongo.MongoClient:
    from dotenv import load_dotenv
    import os
    load_dotenv()
    URL = os.getenv("MONGOTESTURL")
    return pymongo.MongoClient(URL)
# -----------------------------------------------

# Global Clients
# ----------
production_client = get_production_client()
test_client = get_test_client()

def get_production_collection(db_name:str, collection_name:str) -> list:
    """
    Query to select all documents from production collection\n
    Return list of documents
    """
    db = production_client[db_name]
    collection = db[collection_name]

    collection_documents = collection.find(projection={"_id":False})
    collection_documents_list = [doc for doc in collection_documents]
    return collection_documents_list

def clone_and_insert_collection_into_test(db_name:str, collection_name:str) -> None:
    """
    Clone production collection\n
    Create new test database and collection\n
    Insert cloned documents into new test collection\n
    """
    print(f"Starting clone of {db_name}.{collection_name}")
    cloned_documents = get_production_collection(db_name=db_name, collection_name=collection_name)
    new_test_db = test_client[db_name]
    new_test_collection = new_test_db[collection_name]
    print(f"Inserting {db_name}.{collection_name} into test-env cluster")
    new_test_collection.insert_many(documents=cloned_documents)
    return
 
"""
Iterate through each table in production and clone it into test-env
"""
if __name__ == "__main__":
    print('gi')
    # databases = [('SeasonsV2', 'Games'), ('PlayByPlay', 'Games'), ('TeamsDB', 'Teams')]
    # for db in databases:
    #     clone_and_insert_collection_into_test(db_name=db[0], collection_name=db[1])
    